import type { NextApiRequest } from 'next';
import mime from 'mime';
import { join } from 'path';
import * as dateFn from 'date-fns';
import formidable from 'formidable';
import { mkdir, stat } from 'fs/promises';
import { Directory } from 'lib/models';
import Busboy from 'busboy';
import { HandlerEvent } from '@netlify/functions';
import { reject } from 'lodash';

export const FormidableError = formidable.errors.FormidableError;

export function parseMultipartForm(event: HandlerEvent): Promise<{
  fields: { [key: string]: any };
  files:  { [key: string]:{
    type: string,
    content: Buffer,
    encoding: string
  }}
  directory: Directory;
}> {
  return new Promise(resolve => {
    try {
      // we'll store all form fields inside of this
      const fields = {} as { [key: string]: any };

      const files = {} as { [key: string]:{
        type: string,
        content: Buffer,
        encoding: string
      }}

      // let's instantiate our busboy instance!
      const busboy = Busboy({
        // it uses request headers
        // to extract the form boundary value (the ----WebKitFormBoundary thing)
        headers: event.headers,
      });

      // before parsing anything, we need to set up some handlers.
      // whenever busboy comes across a file ...
      busboy.on(
        'file',
        (fieldname, filestream, filename, transferEncoding, mimeType) => {
          // ... we take a look at the file's data ...
          filestream.on('data', data => {
            // ... and write the file's name, type and content into `fields`.
            files[filename] = {
              type: mimeType,
              content: data,
              encoding: transferEncoding
            };
          });
        }
      );

      // whenever busboy comes across a normal field ...
      busboy.on('field', (fieldName, value) => {
        // ... we write its value into `fields`.
        fields[fieldName] = value;
      });

      // once busboy is finished, we resolve the promise with the resulted fields.
      busboy.on('finish', () => {

        const { type, directory: dir } = fields;

        if (type !== 'upload') {
          reject('Unknown NextApiRequest');
          return;
        }

        if (!dir || Array.isArray(dir) || typeof dir !== 'string') {
          reject('No Cloud directory provided');
          return;
        }

        let directory = JSON.parse(dir) as Directory;

        resolve({ fields, files, directory });

      });

      // now that all handlers are set up, we can finally start processing our request!
      busboy.write(event.body);

    } catch (e) {
      reject(e);
    }
  });
}

export const parseForm = async (
  req: NextApiRequest
): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
  directory: Directory;
}> => {
  return new Promise(async (resolve, reject) => {
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/uploads/${dateFn.format(Date.now(), 'dd-MM-Y')}`
    );

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    const form = formidable({
      maxFiles: 5,
      multiples: true,
      maxFileSize: 200 * 1024 * 1024, // 200mb
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${part.originalFilename || 'unknown'}.${
          mime.getExtension(part.mimetype || '') || 'unknown'
        }`;
        return part.originalFilename;
      },
      filter: part => {
        return (
          //part.name === "media" && (part.mimetype?.includes("image") || false)
          part.name.includes('media') || false
        );
      },
    });

    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      else {
        const { type, directory: dir } = fields;

        if (type !== 'upload') {
          reject('Unknown NextApiRequest');
          return;
        }

        if (!dir || Array.isArray(dir) || typeof dir !== 'string') {
          reject('No Cloud directory provided');
          return;
        }

        let directory = JSON.parse(dir) as Directory;

        resolve({ fields, files, directory });
      }
    });
  });
};
