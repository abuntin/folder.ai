import { Directory } from 'lib/models';

import { DOCUMENT_PATH } from '../types';

export { FormidableError, parseForm } from './parse-form';

export { copy, copyFirebaseStorage } from './copy';

export { move } from './move';

export { upload } from './upload';

export { deleteFn, deleteFirebaseStorage } from './delete';

export { list } from './list';

export { fetchDownloadURL } from './download';

export { markAsIndexed, getUserMetadata } from './metadata';

export { generateV4UploadSignedUrl } from './uploadPresigned';

export { indexToPinecone, indexDirectory } from './document';

export const getDocumentPath = ({
  src,
  name,
}: {
  src: Directory;
  name: string;
}) => `${src.fullPath}/${DOCUMENT_PATH}/${name ?? ''}`;

export const getDocumentId = ({
  src,
  name,
}: {
  src: Directory;
  name: string;
}) => `${src.path}/${name}`;
