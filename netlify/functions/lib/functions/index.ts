import { Response } from '@netlify/functions/dist/function/response';

export { FormidableError, parseForm, parseMultipartForm } from './parse-form';

export { copy } from './copy';

export { upload } from './upload';

export { deleteFn } from './delete';

export { uploadS3 } from './uploadS3';

export { copyS3 } from './copyS3';

export { list } from './list';

export const netlifyResponse = (statusCode: number, body: any): Response => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    /* Required for CORS support to work */
    'Access-Control-Allow-Origin': `${process.env.BASE_URL ? `https://*${process.env.BASE_URL}` : 'http://localhost:3000'}`,
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  },
});
