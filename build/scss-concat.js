#!/usr/bin/env node

'use strict'

const concat    = require('concat')
const fs        = require('fs-extra')
const glob      = require('glob')
const path      = require('path')
const rimraf    = require('rimraf')
const base      = path.resolve(__dirname, '..')
const scss      = path.resolve(base, './scss/')
const bootstrap = path.resolve(base, './src/scss/bootstrap/')
const coreui    = path.resolve(base, './src/scss/coreui/')
// const partials  = path.resolve(scss, './partials')

// 1. Znajdź pliki bootstrapa -> dodaj do tablicy
// 2. Znajdź pliki coreui -> dodaj do tablicy
// 3. Znajdź duplikaty w tablicach -> połącz pliki -> skopiuj do scss
// 4. Znajdź unikaty w tablicach -> skopiuj do scss

rimraf(scss, () => {
  fs.mkdir(scss, {
    recursive: true
  }, (err) => {
    if (err) {
      throw err
    }

    // find all scss files in src
    const bsFiles = glob.sync('**/*', {cwd: bootstrap})
    const cuiFiles = glob.sync('**/*', {cwd: coreui})

    const commonFiles = bsFiles.filter((val) => cuiFiles.includes(val))
    const bsUniqueFiles = bsFiles.filter((val) => !commonFiles.includes(val))
    const cuiUniqueFiles = cuiFiles.filter((val) => !commonFiles.includes(val))

    // console.log('Common Files')
    // console.log(commonFiles)
    // console.log('BS Files')
    // console.log(bsUniqueFiles)
    // console.log('CUI Files')
    // console.log(cuiUniqueFiles)

    // Copy Bootstrap's unique files
    bsUniqueFiles.forEach((file) => {
      fs.copySync(`${bootstrap}/${file}`, `${scss}/${file}`)
    })
    // Copy CoreUI's unique files
    cuiUniqueFiles.forEach((file) => {
      fs.copySync(`${coreui}/${file}`, `${scss}/${file}`)
    })
    // Concat common files
    commonFiles.forEach((file) => {
      concat([`${bootstrap}/${file}`, `${coreui}/${file}`], `${scss}/${file}`)
    })
  })
})

// rimraf(partials, () => {
//   fs.mkdir(partials, {
//     recursive: true
//   }, (err) => {
//     if (err) {
//       throw err
//     }
//     fs.readdir(scss, (err, files) => {
//       if (err) {
//         throw err
//       }
//       files.forEach((file) => {
//         if (file.indexOf('.scss') > -1 && file.charAt(0) === '_') {
//           const content = `@import "../core";\n@import "../${file.replace('_', '').replace('.scss', '')}";\n`
//           fs.writeFile(`${partials}/${file.replace('_', '')}`, content, (err) => {
//             if (err) {
//               throw err
//             }
//           })
//         }
//       })
//     })
//   })
// })
