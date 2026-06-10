import {
	type GenerateTypedHelpersOptions,
	generateReactHelpers,
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "../../../../../server/src/config/uploadthing";

//TODO: use real backend url
const BACKEND_URL = "http://localhost:8787/api/uploadthing";

const initOpts = {
	url: BACKEND_URL,
} satisfies GenerateTypedHelpersOptions;

export const UploadButton = generateUploadButton<OurFileRouter>(initOpts);
export const UploadDropzone = generateUploadDropzone<OurFileRouter>(initOpts);
export const { useUploadThing } = generateReactHelpers<OurFileRouter>(initOpts);
