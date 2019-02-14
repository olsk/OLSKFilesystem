/*!
 * OLSKDisk
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const pathPackage = require('path');
const fsPackage = require('fs');
const mkdirpPackage = require('mkdirp');

const mainModule = require('./main');

const kTesting = {
	StubRootDirectory: function (inputData) {
		return pathPackage.join(mainModule.OLSKDiskWorkspaceTestingFolderName(), mainModule.OLSKDiskWorkspaceTestingFolderSubfolderNameFor('os.filesystem'), inputData || '');
	},
	StubRoot: function (inputData) {
		return pathPackage.join(kTesting.StubRootDirectory(), inputData || '');
	},
};

describe('OLSKDiskIsRealFolderPath', function testOLSKDiskIsRealFolderPath() {

	beforeEach(function() {
		mainModule.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('returns false if not path', function() {
		assert.strictEqual(mainModule.OLSKDiskIsRealFolderPath(''), false);
	});

	it('returns false if not real', function() {
		assert.strictEqual(mainModule.OLSKDiskIsRealFolderPath(kTesting.StubRootDirectory()), false);
	});

	it('returns false if not directory', function() {
		mainModule.OLSKDiskCreateFolder(kTesting.StubRootDirectory());
		fsPackage.writeFileSync(kTesting.StubRootDirectory('alfa.txt'), '');
		assert.strictEqual(mainModule.OLSKDiskIsRealFolderPath(kTesting.StubRootDirectory('alfa.txt')), false);
	});

	it('returns true', function() {
		mainModule.OLSKDiskCreateFolder(kTesting.StubRootDirectory());
		assert.strictEqual(mainModule.OLSKDiskIsRealFolderPath(kTesting.StubRootDirectory()), true);
	});

});

describe('OLSKDiskIsRealFilePath', function testOLSKDiskIsRealFilePath() {

	beforeEach(function() {
		mainModule.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	var fileFullPath = pathPackage.join(
		kTesting.StubRootDirectory(),
		'alpha.txt'
	);

	it('returns null if parameter not filesystem path', function() {
		assert.strictEqual(mainModule.OLSKDiskIsRealFilePath(''), false);
	});

	it('returns null if file path does not exist', function() {
		assert.strictEqual(mainModule.OLSKDiskIsRealFilePath(fileFullPath), false);
	});

	it('returns null if path not file', function() {
		mainModule.OLSKDiskCreateFolder(kTesting.StubRootDirectory());
		assert.strictEqual(mainModule.OLSKDiskIsRealFilePath(kTesting.StubRootDirectory()), false);
	});

	it('returns true if file exists', function() {
		mainModule.OLSKDiskCreateFolder(kTesting.StubRootDirectory());
		fsPackage.writeFileSync(fileFullPath, '');
		assert.strictEqual(mainModule.OLSKDiskIsRealFilePath(fileFullPath), true);
	});

});

describe('OLSKDiskCreateFolder', function testOLSKDiskCreateFolder() {

	beforeEach(function() {
		mainModule.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
	});

	it('returns inputData', function() {
		assert.strictEqual(mainModule.OLSKDiskCreateFolder(kTesting.StubRoot('alfa')), kTesting.StubRoot('alfa'));
	});

	it('creates folder', function() {
		assert.strictEqual(fsPackage.existsSync(kTesting.StubRoot('alfa')), false);
		assert.strictEqual(fsPackage.existsSync(mainModule.OLSKDiskCreateFolder(kTesting.StubRoot('alfa'))), true);
	});

	it('does nothing if exists', function() {
		var directoryFullPath = pathPackage.join(kTesting.StubRootDirectory(), 'alpha');
		mainModule.OLSKDiskCreateFolder(directoryFullPath);

		var fileFullPath = pathPackage.join(directoryFullPath, 'bravo.txt');
		fsPackage.writeFileSync(fileFullPath, '');
		assert.strictEqual(fsPackage.existsSync(fileFullPath), true);

		assert.strictEqual(fsPackage.existsSync(mainModule.OLSKDiskCreateFolder(directoryFullPath)), true);
	});

});

describe('OLSKDiskDeleteFolder', function testOLSKDiskDeleteFolder() {

	beforeEach(function() {
		mainModule.OLSKDiskDeleteFolder(kTesting.StubRootDirectory());
		mainModule.OLSKDiskCreateFolder(kTesting.StubRootDirectory());
	});

	it('returns 0 if path does not exist', function() {
		var directoryFullPath = pathPackage.join(
			kTesting.StubRootDirectory(),
			'alpha'
		);

		assert.strictEqual(fsPackage.existsSync(directoryFullPath), false);
		assert.strictEqual(mainModule.OLSKDiskDeleteFolder(directoryFullPath), 0);
	});

	it('returns 0 if path not directory', function() {
		var fileFullPath = pathPackage.join(
			kTesting.StubRootDirectory(),
			'alpha.txt'
		);
		mainModule.OLSKDiskCreateFolder(kTesting.StubRootDirectory());
		fsPackage.writeFileSync(fileFullPath, '');

		assert.strictEqual(mainModule.OLSKDiskDeleteFolder(fileFullPath), 0);
	});

	it('returns 1 and deletes directory', function() {
		var directoryFullPath = pathPackage.join(
			kTesting.StubRootDirectory(),
			'alpha'
		);
		assert.strictEqual(fsPackage.existsSync(directoryFullPath), false);

		var fileFullPath = pathPackage.join(
			directoryFullPath,
			'alpha.txt'
		);
		mainModule.OLSKDiskCreateFolder(directoryFullPath);
		fsPackage.writeFileSync(fileFullPath, '');
		assert.strictEqual(fsPackage.existsSync(fileFullPath), true);

		assert.strictEqual(mainModule.OLSKDiskDeleteFolder(kTesting.StubRootDirectory()), 1);
		assert.strictEqual(fsPackage.existsSync(directoryFullPath), false);
		assert.strictEqual(fsPackage.existsSync(kTesting.StubRootDirectory()), false);
	});

});

describe('OLSKDiskAppFolderName', function testOLSKDiskAppFolderName() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.OLSKDiskAppFolderName(), 'os-app');
	});

});

describe('OLSKDiskCacheFolderName', function testOLSKDiskCacheFolderName() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.OLSKDiskCacheFolderName(), 'os-cache');
	});

});

describe('OLSKDiskDataFolderName', function testOLSKDiskDataFolderName() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.OLSKDiskDataFolderName(), 'os-data');
	});

});

describe('OLSKDiskPublicFolderName', function testOLSKDiskPublicFolderName() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.OLSKDiskPublicFolderName(), 'os-public');
	});

});

describe('OLSKDiskWorkspaceTestingFolderName', function testOLSKDiskWorkspaceTestingFolderName() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.OLSKDiskWorkspaceTestingFolderName(), 'os-workspace-testing');
	});

});

describe('OLSKDiskWorkspaceTestingFolderSubfolderNameFor', function testOLSKDiskWorkspaceTestingFolderSubfolderNameFor() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			mainModule.OLSKDiskWorkspaceTestingFolderSubfolderNameFor(null);
		}, /OLSKErrorInputInvalid/);
	});

	it('throws error if param1 empty', function() {
		assert.throws(function() {
			mainModule.OLSKDiskWorkspaceTestingFolderSubfolderNameFor('');
		}, /OLSKErrorInputInvalid/);
	});

	it('returns subfolderName', function() {
		assert.strictEqual(mainModule.OLSKDiskWorkspaceTestingFolderSubfolderNameFor('os-alpha'), 'test-os-alpha');
		assert.strictEqual(mainModule.OLSKDiskWorkspaceTestingFolderSubfolderNameFor('os-bravo.charlie'), 'test-os-bravo-charlie');
	});

});

describe('OLSKDiskLaunchFileName', function testOLSKDiskLaunchFileName() {

	it('returns launch file name', function() {
		assert.strictEqual(mainModule.OLSKDiskLaunchFileName(), 'os-launch.js');
	});

});

describe('OLSKDiskDefaultTextEncoding', function testOLSKDiskDefaultTextEncoding() {

	it('returns system directory name', function() {
		assert.strictEqual(mainModule.OLSKDiskDefaultTextEncoding(), 'utf8');
	});

});

describe('OLSKDiskSafeBasenameFor', function testOLSKDiskSafeBasenameFor() {

	it('throws if not string', function() {
		assert.throws(function() {
			mainModule.OLSKDiskSafeBasenameFor(null);
		});
	});

	it('returns identical if no illegal characters', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha'), 'alpha');
	});

	it('returns without dot', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha.bravo'), 'alpha bravo');
	});

	it('returns without Comma', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha,bravo'), 'alpha bravo');
	});

	it('returns without Semicolon', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha;bravo'), 'alpha bravo');
	});

	it('returns without Colon', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha:bravo'), 'alpha bravo');
	});

	it('returns without Star', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha*bravo'), 'alpha bravo');
	});

	it('returns without Question', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha?bravo'), 'alpha bravo');
	});

	it('returns without Pipeline', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha|bravo'), 'alpha bravo');
	});

	it('returns without Underscore', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha_bravo'), 'alpha bravo');
	});

	it('returns without GreaterLessThan', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha<bravo>charlie'), 'alpha bravo charlie');
	});

	it('returns without Slashes', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha/bravo\\charlie'), 'alpha bravo charlie');
	});

	it('returns without Quotes', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('"alpha" \'bravo\' “charlie” ‘delta’ «echo»'), 'alpha bravo charlie delta echo');
	});

	it('returns without Whitespace', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha\nbravo\tcharlie'), 'alpha bravo charlie');
	});

	it('returns without DisallowedMultiple', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha \n\t bravo'), 'alpha bravo');
	});

	it('returns without DisallowedEnds', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor(' \n\t alpha bravo \t\n '), 'alpha bravo');
	});

	it('returns without Dashes', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('alpha-bravo–charlie—delta'), 'alpha-bravo–charlie—delta');
	});

	it('returns without Brackets', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('(alpha) [bravo] {charlie}'), '(alpha) [bravo] {charlie}');
	});

	it('returns without International', function() {
		assert.strictEqual(mainModule.OLSKDiskSafeBasenameFor('àlpha niño 縦書き 😀 € $'), 'àlpha niño 縦書き 😀 € $');
	});

});
