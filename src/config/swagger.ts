import YAML from 'yamljs';
import path from 'path';

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

export default swaggerDocument; 