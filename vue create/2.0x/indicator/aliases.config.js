const path = require('path')
const fs = require('fs')
const prettier = require('prettier')
const globby = require('globby')
const camelCase = require('lodash/camelCase')

const cwd = process.cwd()

const { error } = require('@vue/cli-shared-utils')

const aliases = {
    '$public': resolveCwd('public'),
    '@': resolveCwd('src'),
    '@@': resolveCwd('.'),
    '@components': resolveCwd('src/components'),
    '@utils': resolveCwd('src/utils'),
    '@styles': resolveCwd( 'src/styles'),
    '@resources':resolveCwd( 'src/resources'),
    'vue': resolveCwd( 'node_modules/vue/dist/vue.js'),
    'VUE': resolveCwd( 'node_modules/vue/dist/vue.js')
}

globby.sync(path.posix.join('src', 'packages'),{
    expandDirectories: {
        files: ['main.js']
    }
} ) .forEach((fileName) => {
    const filePath = fileName
        .replace(/^src\/packages\//, '')
        .replace(/\/main\.js$/, '')
        .split(/\//)
    const key = '@' + camelCase(filePath)
    aliases[key] = path.dirname(resolveCwd( fileName))
})

module.exports = {
    webpack: {},
    jest: {},
    jsconfig: {},
}

for (const alias in aliases) {
    const aliasTo = aliases[alias]
    module.exports.webpack[alias] = resolveDirname(aliasTo)
    const aliasHasExtension = /\.\w+$/.test(aliasTo)
    module.exports.jest[`^${alias}$`] = aliasHasExtension
        ? `<rootDir>/${aliasTo}`
        : `<rootDir>/${aliasTo}/index.js`
    module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`
    module.exports.jsconfig[alias + '/*'] = [aliasTo + '/*']
    module.exports.jsconfig[alias] = aliasTo.includes('/index.')
        ? [aliasTo]
        : [
            aliasTo + '/index.js',
            aliasTo + '/index.json',
            aliasTo + '/InstrumentClusterBasic.vue',
            aliasTo + '/index.scss',
            aliasTo + '/index.css',
        ]
}

const jsconfigTemplate = {
    baseUrl: '.',
    include: ['src/**/*', 'tests/**/*'],
    compilerOptions: {
        baseUrl: '.',
        target: 'esnext',
        module: 'es2015',
    },
}

const jsconfigPath = resolveCwd('jsconfig.json')

fs.writeFile(
    jsconfigPath,
    prettier.format(
        JSON.stringify({
            ...jsconfigTemplate,
            compilerOptions: {
                ...(jsconfigTemplate.compilerOptions || {}),
                paths: module.exports.jsconfig,
            },
        }),
        {
            ...require(resolveCwd( '.prettierrc')),
            parser: 'json',
        }
    ),
    (err) => {
        if (err) {
            error(
                '生成 jsconfig 时发生异常' + '\n'
            )
            process.exit(1)
        }
    }
)

function resolveDirname(_path) {
    return path.resolve(__dirname, _path)
}

function resolveCwd(_path) {
    return path.resolve(cwd, _path)
}
