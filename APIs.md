# 🌐 URLs E APIs

## URLs
URL do backend não definitiva.
```plaintext
Clayton: 
IP: 192.168.10.5
PORT: 9005
URL BASE: http://192.168.10.5:9005/

Fernando: 
IP: 192.168.10.19
PORT: 9005
URL BASE: http://192.168.10.19:9005/
```

## APIs

Baixar a collection do Insomnia para testar as APIs:

[simplesfique-collection](..%2F..%2Fsimplesfique-collection) <br>
[simplesfique-collection.yaml](..%2F..%2Fsimplesfique-collection.yaml)

``` plaintext
Content-Type: application/json 
{
  headers: {Authorization: `Bearer ${this.token}`}
}
``` 

### Empresas: - ok

| Método | Endpoint | Descrição                                  |
|--------|-----------|--------------------------------------------|
| **POST** | `/empresa` | Cadastrar empresa — passar um JSON `"data"` |
| **GET** | `/empresa/` | Retorna todas as empresas                  |
| **GET** | `/empresa/:id` | Retornar dados da empresa                  |
| **PUT** | `/empresa/:id` | Alterar dados da empresa                   |
| **DELETE** | `/empresa/:id` | Inativar / excluir empresa                 |

```bash
### Exemplo de JSON para cadastro/alteração de empresa:
{
  "data": [{
    "id_saas": 1,
    "razao_social": "Bonfire Solutions LTDA",
    "fantasia": "Bonfire Studio",
    "telefone": "6532121234",
    "celular": "65981234567",
    "whatsapp": "65981234567",
    "cnpj": "12345678000199",
    "insc_estadual": "1234567890",
    "insc_municipal": "456789123",
    "insc_suframa": "987654321",
    "insc_subst_trib": "123456",
    "endereco": "Rua das Palmeiras, 1200",
    "numero": "1200",
    "cep": "78048000",
    "id_cidade": 5103403,
    "id_bairro": 2,
    "complemento": "Sala 02",
    "perfil": "empresarial",
    "crt": "1",
    "cnae": "6201-5/00",
    "ident_interna": "BF-001",
    "id_clifor_vst": 10,
    "matriz": "S",
    "ativo": "S",
    "dh_cadastro": "2025-10-16T14:00:00",
    "dh_ativacao": "2025-10-16T14:00:00",
    "dh_expiracao": "2026-10-16T14:00:00",
    "tp_contrato": "1",
    "tp_perfil": "1"
  }]
}
````

### SAAS:

| Método | Endpoint | Descrição                                    |
|--------|---------|----------------------------------------------|
| **POST** | `/saas` | Cadastro raiz SAAS — passar um JSON `"data"` |
| **GET** | `/saas` | Retorna todos os SAAS                        |
| **GET** | `/saas/:email` | Retorna dados do SAAS                        |
| **DELETE** | `/saas/:email` | Inativa / exclui SAAS                        |

```bash
### Exemplo de JSON para cadastro/alteração de SAAS:
{
  "data": [{
    "nome": "Bonfire SAAS Raiz",
    "email": "admin@bonfire.com",
    "telefone": "65998765432",
    "dh_cadastro": "2025-10-16T14:00:00",
    "ativo": "S"
  }]
}
```

### País:

```Plaintext
API sendo consumida em: stores/APIs/localizacao.js
```

| Método | Endpoint | Descrição                               |
|--------|---------|-----------------------------------------|
| **GET** | `/pais` | Retorna todos os países                 |
| **GET** | `/pais/:id` | Retornar dados do país                  |


### UF:

```Plaintext
API sendo consumida em: stores/APIs/localizacao.js
```

| Método | Endpoint | Descrição                             |
|--------|-------|---------------------------------------|
| **GET** | `/uf` | Retorna todas as UFs                  |
| **GET** | `/uf/:id` | Retornar dados da UF                  |


### Cidade: - ok

``` Plaintext
API sendo consumida em: stores/APIs/localizacao.js
```

| Método | Endpoint | Descrição                                 |
|--------|-----------|-------------------------------------------|
| **GET** | `/cidade` | Retorna todas as cidades                  |
| **GET** | `/cidade/:id` | Retornar dados da cidade                  |


### Feriado:

```Plaintext
API sendo consumida em: stores/APIs/localizacao.js
```

| Método | Endpoint | Descrição                                   |
|--------|-----------|---------------------------------------------|
| **POST** | `/feriado` | Cadastrar feriado — passar um JSON `"data"` |
| **GET** | `/feriado` | Retorna todos os feriados                   |
| **GET** | `/feriado/:id` | Retornar dados do feriado                   |
| **PUT** | `/feriado/:id` | Alterar dados do feriado                    |
| **DELETE** | `/feriado/:id` | Excluir feriado                             |

```bash
### Exemplo de JSON para cadastro/alteração de feriado:
{
  "data": [{
    "id": 1
    "descferiado": "Natal",
    "dia_feriado": "2025-12-25",
    "tipo_feriado": "Nacional",
    "id_cidade": null,
  }]
}
```

### CEP: - ok

``` Plaintext
API sendo consumida em: stores/APIs/localizacao.js
```

| Método  | Endpoint    | Descrição              |
|---------|-------------|------------------------|
| **GET** | `/cep`      | retornar todos os ceps |
| **GET** | `/cep/:cep` | retornar dados do cep  |


### Bairro: - ok

``` Plaintext
API sendo consumida em: stores/APIs/localizacao.js
```

| Método | Endpoint       | Descrição                                   |
|:-------|:----------------|:--------------------------------------------|
| **GET**    | `/bairro`        | Retornar dados de todos os bairros        | 
| **GET**    | `/bairro/:id`    | Retornar dados de um bairro específico    |


### Atividade: 

| Método | Endpoint | Descrição                                     |
|--------|-----------|-----------------------------------------------|
| **POST** | `/atividade` | Cadastrar atividade — passar um JSON `"data"` |
| **GET** | `/atividade` | Retorna todas as atividades                   |
| **GET** | `/atividade/:id` | Retornar dados da atividade                   |
| **PUT** | `/atividade/:id` | Alterar dados da atividade                    |
| **DELETE** | `/atividade/:id` | Excluir atividade                             |

```bash
### Exemplo de JSON para cadastro/alteração de atividade:
{
  "data": [{
    "id": 1
    "descatividade": "Desenvolvimento de Software",
  }]
}
```

### Classe Pessoa: 

| Método | Endpoint | Descrição                                        |
|--------|-----------|--------------------------------------------------|
| **POST** | `/classepessoa` | Cadastrar classepessoa — passar um JSON `"data"` |
| **GET** | `/classepessoa` | Retornar todas as classepessoas                  |
| **GET** | `/classepessoa/:id` | Retornar dados da classepessoa                   |
| **PUT** | `/classepessoa/:id` | Alterar dados da classepessoa                    |
| **DELETE** | `/classepessoa/:id` | Excluir classepessoa                             |

```bash
### Exemplo de JSON para cadastro/alteração de classepessoa:
{
  "data": [{
    "id": 1
    "descclassepessoa": "Cliente",
  }]
}
```

### Pessoa: - ok

| Método | Endpoint | Descrição                                  |
|--------|-----------|--------------------------------------------|
| **POST** | `/pessoa` | Cadastrar pessoa — passar um JSON `"data"` |
| **GET** | `/pessoa` | Retorna todas as pessoas                   |
| **GET** | `/pessoa/:id` | Retornar dados da pessoa                   |
| **PUT** | `/pessoa/:id` | Alterar dados da pessoa                    |
| **DELETE** | `/pessoa/:id` | Excluir pessoa                             |

```bash
### Exemplo de JSON para cadastro/alteração de pessoa:
{
  "data": [{
    "id_empresa": 1,
    "tipo_pessoa": "J",
    "nome_razao": "Tech VST Soluções LTDA",
    "apelido_fantasia": "VST Soluções",
    "cpf_cnpj": "12345678000199",
    "rg_inscricao": "123456789",
    "telefone": "6532121234",
    "celular": "65998765432",
    "whats": "65998765432",
    "website": "https://www.vstsolution.com",
    "cliente": "S",
    "fornecedor": "N",
    "transportadora": "N",
    "colaborador": "N",
    "representante": "S",
    "instagram": "https://instagram.com/vstsolution",
    "facebook": "https://facebook.com/vstsolution",
    "twitter_x": "https://twitter.com/vstsolution",
    "tik_tok": "https://tiktok.com/@vstsolution",
    "telegram": "https://t.me/vstsolution",
    "latitude": -15.601410,
    "longitude": -56.097892,
    "dh_cadastro": "2025-10-16T14:00:00",
    "dh_alteracao": "2025-10-16T14:30:00",
    "ativo": "S"
  }]
}
```

### Departamento:

| Método | Endpoint | Descrição                                        |
|--------|-----------|--------------------------------------------------|
| **POST** | `/departamento` | Cadastrar departamento — passar um JSON `"data"` |
| **GET** | `/departamento` | Retorna todos os departamentos                   |
| **GET** | `/departamento/:id` | Retornar dados do departamento                   |
| **PUT** | `/departamento/:id` | Alterar dados do departamento                    |
| **DELETE** | `/departamento/:id` | Excluir departamento                             |

```bash
### Exemplo de JSON para cadastro/alteração de departamento:
{
  "data": [{
    "id": 1
    "descdepartamento": "Recursos Humanos",
  }]
}
```

### CNPJ: - ok

| Método  | Endpoint      | Descrição              |
|---------|---------------|------------------------|
| **GET** | `/cnpj/:cnpj` | retornar dados do cnpj |
|         |               |                        |


### NBS:

| Método     | Endpoint   | Descrição                 |
| ---------- | ---------- | ------------------------- |
| **POST**   | `/nbs`     | Cadastra um novo NBS      |
| **GET**    | `/nbs`     | Lista todos os NBS        |
| **GET**    | `/nbs/:id` | Retorna um NBS específico |
| **PUT**    | `/nbs/:id` | Altera um NBS existente   |
| **DELETE** | `/nbs/:id` | Exclui um NBS             |

```bash
### Exemplo de JSON:
{
  "data": [{
    "item_lc": "12345",
    "descricao": "Serviços de Software",
    "dhinc": "2025-11-04T12:00:00",
    "dhalt": null,
    "id_user_inc": 1,
    "id_user_alt": null,
    "ativo": "S"
  }]
}
```

### CEST:

| Método     | Endpoint                 | Descrição                  |
| ---------- | ------------------------ | -------------------------- |
| **POST**   | `/cest`                  | Cadastra um novo CEST      |
| **GET**    | `/cest`                  | Lista todos os CEST        |
| **GET**    | `/cest/:id/:idncm/:iduf` | Retorna um CEST específico |
| **PUT**    | `/cest/:id/:idncm/:iduf` | Altera um CEST existente   |
| **DELETE** | `/cest/:id/:idncm/:iduf` | Exclui um CEST             |

```bash
### Exemplo de JSON:
{
  "data": [{
    "id_ncm": 12345678,
    "id_uf": 51,
    "descricao": "Cesta básica - Alimentos",
    "pmva": 12.5,
    "dhinc": "2025-11-04T12:00:00",
    "dhalt": null,
    "id_user_inc": 1,
    "id_user_alt": null,
    "ativo": "S"
  }]
}
```

### CLASSE: - ok

| Método     | Endpoint      | Descrição                     |
| ---------- | ------------- | ----------------------------- |
| **POST**   | `/classe`     | Cadastra uma nova Classe      |
| **GET**    | `/classe`     | Lista todas as Classes        |
| **GET**    | `/classe/:id` | Retorna uma Classe específica |
| **PUT**    | `/classe/:id` | Altera uma Classe existente   |
| **DELETE** | `/classe/:id` | Exclui uma Classe             |

```bash
### Exemplo de JSON:
{
  "data": [{
    "id_saas": 1,
    "descclasse": "Serviços de Tecnologia",
    "ativo": "S"
  }]
}
```

### NCM: 

| Método  | Endpoint   | Descrição                 |
| ------- | ---------- | ------------------------- |
| **GET** | `/ncm`     | Lista todos os NCM        |
| **GET** | `/ncm/:id` | Retorna um NCM específico |
| **PUT** | `/ncm/:id` | Altera um NCM existente   |

```bash
### Exemplo de JSON:
{
  "data": [{
    "desc_ncm": "Produtos eletrônicos",
    "dhinc": "2025-11-04T12:00:00",
    "dhalt": null,
    "id_user_inc": 1,
    "id_user_alt": null,
    "ativo": "S"
  }]
}
```

### GRUPO: - ok

| Método     | Endpoint     | Descrição                   |
| ---------- | ------------ | --------------------------- |
| **POST**   | `/grupo`     | Cadastra um novo Grupo      |
| **GET**    | `/grupo`     | Lista todos os Grupos       |
| **GET**    | `/grupo/:id` | Retorna um Grupo específico |
| **PUT**    | `/grupo/:id` | Altera um Grupo existente   |
| **DELETE** | `/grupo/:id` | Exclui um Grupo             |

```bash
### Exemplo de JSON:
{
  "data": [{
    "id_saas": 1,
    "descgrupo": "Financeiro",
    "foto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
    "ativo": "S"
  }]
}
```

### SUBGRUPO: - ok

| Método     | Endpoint                 | Descrição                                 |
| ---------- | ------------------------ | ----------------------------------------- |
| **POST**   | `/Subgrupo/:idgrupo`     | Cadastra um Subgrupo vinculado a um Grupo |
| **GET**    | `/Subgrupo/:idgrupo`     | Lista Subgrupos de um Grupo               |
| **GET**    | `/Subgrupo/:idgrupo/:id` | Retorna um Subgrupo específico            |
| **PUT**    | `/Subgrupo/:idgrupo/:id` | Altera um Subgrupo existente              |
| **DELETE** | `/Subgrupo/:idgrupo/:id` | Exclui um Subgrupo                        |

```bash
### Exemplo de JSON:
{
  "data": [{
    "id_saas": 1,
    "id_grupo": 2,
    "descsubgrupo": "Contas a Pagar",
    "perc_comissao_vendedor": 5.0,
    "perc_comissao_tecnico": 2.5,
    "indice_custo": 1.1,
    "indice_venda": 1.4,
    "foto": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
    "ativo": "S"
  }]
}
```