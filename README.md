# Pesquisa de Placas no Estado da Paraíba

Atualmente, a pesquisa por placas de trânsito em nível nacional é limitada pela falta de uma API pública que disponibilize informações gratuitamente.
Pensando nisso, a biblioteca search-plate-pb utiliza um crawler simples na página do Detran-PB para retornar as informações de quaisquer placas do estado da PB.

## Como usar?

```shell
npm i search-plate-pb 
```

```js
const { searchPlate } = require('search-plate-pb')

const plate = await searchPlate('XXX1234')
```

- searchPlate(plate_number): 
    Função que retorna diversas informações a respeito da placa passada como parâmetro
