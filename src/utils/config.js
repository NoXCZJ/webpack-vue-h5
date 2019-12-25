// check ENV
const version = '1.0';
const requestURL = '/test/';
const baseConfig = {
  uploadPath: `${requestURL}/file/nick/upload`

};

// dev config
const devConfig = {
  BaseUrl: '',
  requestPath: `${requestURL}`,
  uploadUrl: `${baseConfig.uploadPath}`,
  version
};

// prod config
const prodConfig = {
  BaseUrl: '',
  requestPath: `${requestURL}`,
  uploadUrl: `${baseConfig.uploadPath}`,
  version
};

const config =
  process.env.ENV === 'prod'
    ? Object.assign({}, baseConfig, prodConfig)
    : Object.assign({}, baseConfig, devConfig);

export default config;
