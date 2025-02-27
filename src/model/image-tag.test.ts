import ImageTag from './image-tag';

jest.spyOn(ImageTag, 'getImagePlatformPrefix').mockReturnValue('ubuntu');

describe('ImageTag', () => {
  const some = {
    editorVersion: '2099.9.f9f9',
    targetPlatform: 'Test',
    builderPlatform: '',
  };

  const defaults = {
    repository: 'unityci',
    name: 'editor',
    image: 'unityci/editor',
  };

  describe('constructor', () => {
    it('can be called', () => {
      const { targetPlatform } = some;
      expect(() => new ImageTag({ platform: targetPlatform })).not.toThrow();
    });

    it('accepts parameters and sets the right properties', () => {
      const image = new ImageTag(some);

      expect(image.repository).toStrictEqual('unityci');
      expect(image.name).toStrictEqual('editor');
      expect(image.editorVersion).toStrictEqual(some.editorVersion);
      expect(image.targetPlatform).toStrictEqual(some.targetPlatform);
      expect(image.targetPlatformSuffix).toStrictEqual(some.builderPlatform);
    });

    test.each(['2000.0.0f0', '2011.1.11f1'])('accepts %p version format', editorVersion => {
      expect(
        () => new ImageTag({ editorVersion, targetPlatform: some.targetPlatform }),
      ).not.toThrow();
    });

    test.each(['some version', '', 1])('throws for incorrect versions %p', editorVersion => {
      const { targetPlatform } = some;
      expect(() => new ImageTag({ editorVersion, targetPlatform })).toThrow();
    });
  });

  describe('toString', () => {
    it('returns the correct version', () => {
      const image = new ImageTag({
        editorVersion: '2099.1.1111',
        targetPlatform: some.targetPlatform,
      });

      expect(image.toString()).toStrictEqual(`${defaults.image}:ubuntu-2099.1.1111-1`);
    });
    it('returns customImage if given', () => {
      const image = new ImageTag({
        editorVersion: '2099.1.1111',
        targetPlatform: some.targetPlatform,
        customImage: `${defaults.image}:2099.1.1111@347598437689743986`,
      });

      expect(image.toString()).toStrictEqual(image.customImage);
    });

    it('returns the specific build platform', () => {
      const image = new ImageTag({ editorVersion: '2022.3.7f1', targetPlatform: 'WebGL' });

      expect(image.toString()).toStrictEqual(`${defaults.image}:ubuntu-2022.3.7f1-webgl-1`);
    });

    it('returns no specific build platform for generic targetPlatforms', () => {
      const image = new ImageTag({ targetPlatform: 'NoTarget' });

      expect(image.toString()).toStrictEqual(`${defaults.image}:ubuntu-2022.3.7f1-1`);
    });
  });
});
