#!/usr/bin/env node

import getPort from 'get-port';

import { defaultConfig, Config } from './lib/config';
import { serveDirectory } from './lib/serve-dir';
import { convertMdToPdf } from './lib/md-to-pdf';
import { getDir } from './lib/helpers';

/**
 * Convert a markdown file to PDF.
 *
 * @returns the path that the PDF was written to
 */
export const mdToPdf = async (input: { path: string } | { content: string }, config: Partial<Config> = {}) => {
	if (!('path' in input ? input.path : input.content)) {
		throw new Error('Specify either content or path.');
	}

	if (!config.port) {
		config.port = await getPort();
	}

	if (!config.basedir) {
		config.basedir = 'path' in input ? getDir(input.path) : process.cwd();
	}

	const mergedConfig: Config = {
		...defaultConfig,
		...config,
		pdf_options: { ...defaultConfig.pdf_options, ...config.pdf_options },
	};

	const server = await serveDirectory(mergedConfig);

	const pdf = await convertMdToPdf(input, mergedConfig);

	server.close();

	return pdf;
};

export default mdToPdf;
