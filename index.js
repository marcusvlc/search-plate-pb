const cheerio = require("cheerio");
const axios = require('axios')


const DETRAN_PB_PLATE_SEARCH_URL = 'http://wsdetran.pb.gov.br/DT_DUT_Cliente/ConsultaDUT'
const DISPLAY_TYPE = 'web'
const DEFAULT_CHILDREN_VALUE = 33
const plateRegex = '[A-Z]{3}[0-9][0-9A-Z][0-9]{2}';



const getPlateAttributes = () => {
    const attributes = [
      {ultimo_licenciamento: 'ultimolicenciamento'}, 
      {proprietario: 'proprietario'}, 
      {placa: 'placa'}, 
      {tipo_combustivel: 'combustivel'}, 
      {modelo: 'marca/modelo'}, 
      {tipo: 'especie/tipo'},
      {ano_de_fabricacao: 'anodefabricacao'},
      {ano_modelo: 'anomodelo'},
      {categoria: 'categoria'},
      {cor: 'corpredominante'},
      {vencimento_licenciamento: 'vencimentolicenciamento'},
      {observacao: 'observacao'},
      {restricao: 'restricao'},
      {financeira: 'financeira'},
      {municipio: 'municipio'},
      {situacao: 'situacao'},
      {data_consulta: 'datadaconsulta'},
      {version: 'vs.2020.2'}
    ]
  
    return attributes
}
  
const getOptions = () => {
    const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    return config
}

async function searchPlate (plate_number) {
    if (!plate_number.match(plateRegex)) {
    	throw new Error('Placa possui formato inválido');
    }

    const config = getOptions()
    const attributes = getPlateAttributes()

    const params = new URLSearchParams()
    params.append('placa', plate_number)
    params.append('display', DISPLAY_TYPE)

    const body = await axios.post(DETRAN_PB_PLATE_SEARCH_URL, params, config)
    
    const $ = cheerio.load(body.data)
    let plate_attributes = {}
    let foundPlate = false

    $('font').each(function() {
        if ($(this).children().length == DEFAULT_CHILDREN_VALUE ) {
        foundPlate = true
        const plate_information = ($(this).text()
        .trim()
        .replace(/\s/g, '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .toLowerCase())

        attributes.forEach( (attribute, index) => {
            const field_name = Object.entries(attribute)[0][0]
            const field_in_string = Object.entries(attribute)[0][1]
            if (field_name == 'version') return;

            const next_attribute = attributes[index + 1]
            const next_field_in_string = Object.entries(next_attribute)[0][1]

            const start_index_current_field = plate_information.indexOf(field_in_string)
            const start_index_next_field = plate_information.indexOf(next_field_in_string)

            const value = plate_information.slice(start_index_current_field + field_in_string.length + 1,  start_index_next_field)
            
            plate_attributes[field_name] = value

        })
        }
    })

    if (!foundPlate) throw new Error('A placa fornecida é inválida ou não pertence ao estado da PB');
    
    return (plate_attributes)

}

module.exports = {
    searchPlate
}