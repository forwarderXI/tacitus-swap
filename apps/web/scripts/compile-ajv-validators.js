/* eslint-env node */

const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')
const standaloneCode = require('ajv/dist/standalone').default
const addFormats = require('ajv-formats')
const schema = require('@uniswap/token-lists/dist/tokenlist.schema.json')

// Ensure the generated directory exists
const generatedDir = path.join(__dirname, '../src/utils/__generated__')
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true })
}

const tokenListAjv = new Ajv({ code: { source: true, esm: true } })
addFormats(tokenListAjv)
const validateTokenList = tokenListAjv.compile(schema)
let tokenListModuleCode = standaloneCode(tokenListAjv, validateTokenList)
fs.writeFileSync(path.join(generatedDir, 'validateTokenList.js'), tokenListModuleCode)

const tokensAjv = new Ajv({ code: { source: true, esm: true } })
addFormats(tokensAjv)
const validateTokens = tokensAjv.compile({ ...schema, required: ['tokens'] })
let tokensModuleCode = standaloneCode(tokensAjv, validateTokens)
fs.writeFileSync(path.join(generatedDir, 'validateTokens.js'), tokensModuleCode)
