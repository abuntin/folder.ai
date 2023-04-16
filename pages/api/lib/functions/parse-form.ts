import type { NextApiRequest } from 'next';
import mime from 'mime';
import { join } from 'path';
import * as dateFn from 'date-fns';
import formidable from 'formidable';
import { mkdir, stat } from 'fs/promises';
import { Directory } from 'lib/models';

export const FormidableError = formidable.errors.FormidableError;

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
          return
        }

        if (!dir || Array.isArray(dir) || typeof dir !== 'string') {
          reject('No Cloud directory provided');
          return
        }

        let directory = JSON.parse(dir) as Directory;

        resolve({ fields, files, directory });
      }
    });
  });
};
