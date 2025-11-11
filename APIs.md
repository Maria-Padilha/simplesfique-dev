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

### SAAS: - ok

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


### Cidade: - (modal - consumir na tela de produtos - ok)

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


### Bairro: - (modal - consumir na tela de produtos - ok)

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

### CEST: - ok

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

### NCM: (modal - consumir na tela de produtos - ok)

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

### Marca:

| Método     | Endpoint     | Descrição                    |
| ---------- | ------------ | ---------------------------- |
| **POST**   | `/marca`     | Cadastra uma nova Marca      |
| **GET**    | `/marca`     | Lista todas as Marcas        |
| **GET**    | `/marca/:id` | Retorna uma Marca específica |
| **PUT**    | `/marca/:id` | Altera uma Marca existente   |
| **DELETE** | `/marca/:id` | Exclui uma Marca             |

```bash
### Exemplo de JSON:
{
  "data": [{
    "descmarca": "Apple",
    "ativo": "S"
  }]
}
```

### Localização: 

| Método     | Endpoint           | Descrição                          |
| ---------- | ------------------ | ---------------------------------- |
| **POST**   | `/localizacao`     | Cadastra uma nova Localização      |
| **GET**    | `/localizacao`     | Lista todas as Localizações        |
| **GET**    | `/localizacao/:id` | Retorna uma Localização específica |
| **PUT**    | `/localizacao/:id` | Altera uma Localização existente   |
| **DELETE** | `/localizacao/:id` | Exclui uma Localização             |

```bash
### Exemplo de JSON:
{
  "data": [{
    "desclocalizacao": "Depósito Central",
    "rua": "A",
    "bloco": "3",
    "prateleira": "Superior",
    "coluna": "4",
    "ativo": "S"
  }]
}
```

### Medida: (modal)

| Método  | Endpoint      | Descrição                          |
| ------- | ------------- | ---------------------------------- |
| **GET** | `/medida`     | Lista todas as Medidas disponíveis |
| **GET** | `/medida/:id` | Retorna uma Medida específica      |

```bash
### Exemplo de JSON (retorno esperado):
{
  "data": [{
    "id": 1,
    "descmedida": "Unidade",
    "sigla": "UN",
    "ativo": "S"
  }]
}
```

### Garantia: (modal)

| Método     | Endpoint        | Descrição                       |
| ---------- | --------------- | ------------------------------- |
| **POST**   | `/garantia`     | Cadastra uma nova Garantia      |
| **GET**    | `/garantia`     | Lista todas as Garantias        |
| **GET**    | `/garantia/:id` | Retorna uma Garantia específica |
| **PUT**    | `/garantia/:id` | Altera uma Garantia existente   |
| **DELETE** | `/garantia/:id` | Exclui uma Garantia             |

```bash
### Exemplo de JSON:
{
  "data": [{
    "descgarantia": "Garantia Estendida",
    "tipo": "M", 
    "quantidade": 12,
    "ativo": "S"
  }]
}

tipo: 

1=HORA
2=MES
3=ANO
4=KM
```

### PRODUTO:

| Método | Endpoint       | Operação  |
| ------ | -------------- | --------- |
| POST   | `/produto`     | CADASTRAR |
| GET    | `/produto`     | LISTAR    |
| GET    | `/produto/:id` | OBTER     |
| PUT    | `/produto/:id` | ALTERAR   |
| DELETE | `/produto/:id` | DELETAR   |

```bash
### Exemplo de JSON para cadastro/alteração de produto:
{
  "data": [{
  "descproduto": "Catalisador Toyota Corolla 1.8",
  "aplicacao": "A",
  "tipo": "P",
  "codigo_gtin": "7896541230001",
  "codigo_sku": "CAT-COROLLA-18",
  "codigo_fab": "COR18CAT",
  "codigo_ref": "REF12345",
  "id_grupo": 3,
  "id_subgrupo": 14,
  "id_marca": 5,
  "id_medida": 2,
  "id_classe": 7,
  "id_garantia": 1,
  "utiliza_balanca": "N",
  "utiliza_grade": "S",
  "utiliza_nserie": "N",
  "utiliza_lote": "N",
  "id_ncm": "84213925",
  "em_promocao": "N",
  "observacao": "Produto revisado, original.",
  "ativo": "S"
}]
}

Tipo: 

P = Produto
S = Serviço

Aplicação:

V=PRODUTO PARA COMERCIALIZAÇÃO VENDA
C=PRODUTO PARA CONSUMO 
M=MATÉRIA-PRIMA
I=IMOBILIZADO
```

### PRODUTO - EMBALAGEM:

| Método | Endpoint             | Operação  |
| ------ | -------------------- | --------- |
| POST   | `/proemb`            | CADASTRAR |
| GET    | `/proemb/:idpro`     | LISTAR    |
| GET    | `/proemb/:idpro/:id` | OBTER     |
| PUT    | `/proemb/:idpro/:id` | ALTERAR   |
| DELETE | `/proemb/:idpro/:id` | DELETAR   |

```bash
### Exemplo de JSON para cadastro/alteração de embalagem de produto:
{
  "data": [{
  "id_produto": 10,
  "qtd_embalagem": 2.0000,
  "descembalagem": "Caixa reforçada tamanho M",
  "ativo": "S"
}]
}
```

### PRODUTO - FORNECEDOR:

| Método | Endpoint             | Operação  |
| ------ | -------------------- | --------- |
| POST   | `/profor`            | CADASTRAR |
| GET    | `/profor/:idpro`     | LISTAR    |
| GET    | `/profor/:idpro/:id` | OBTER     |
| PUT    | `/profor/:idpro/:id` | ALTERAR   |
| DELETE | `/profor/:idpro/:id` | DELETAR   |

```bash
### Exemplo de JSON para cadastro/alteração de fornecedor de produto:
{
  "data": [{
  "id_pessoa": 22,
  "id_nota": 15789,
  "id_serie": "A1",
  "dtultima_compra": "2025-02-13T14:32:00",
  "qtde_ultima_compra": 10.0000,
  "custo_ultima_compra": 520.90
}]
}
```

### PRODUTO - IMAGEM:

| Método | Endpoint              | Operação  |
| ------ | --------------------- | --------- |
| POST   | `/profoto`            | CADASTRAR |
| GET    | `/profoto/:idpro`     | LISTAR    |
| GET    | `/profoto/:idpro/:id` | OBTER     |
| PUT    | `/profoto/:idpro/:id` | ALTERAR   |
| DELETE | `/profoto/:idpro/:id` | DELETAR   |

```bash
### Exemplo de JSON para cadastro/alteração de imagem de produto:
{
  "data": [{
  "foto": "iVBORw0KGgoAAAANSUhEUgAAAoAAAADgCAYAAADH...",
  "ativo": "S"
}]
}
```

### PRODUTO - KIT:

| Método | Endpoint                       | Operação  |
| ------ | ------------------------------ | --------- |
| POST   | `/prokit`                      | CADASTRAR |
| GET    | `/prokit/:idpro`     | LISTAR    |
| GET    | `/prokit/:idpro/:id` | OBTER     |
| PUT    | `/prokit/:idpro/:id` | ALTERAR   |
| DELETE | `/prokit/:idpro/:id` | DELETAR   |

```bash
### Exemplo de JSON para cadastro/alteração de kit de produto:
{
  "data": [{
  "id_cor": "001",
  "id_tamanho": "G",
  "quantidade": 5.0000,
  "perc_desconto": 10.00,
  "perc_comissao": 5.00,
  "preco_venda_kit": 3980.500,
  "margem": 35.50,
  "ativo": "S"
}]
}
```

### PRODUTO SIMILAR:

| Método | Endpoint             | Operação  |
| ------ | -------------------- | --------- |
| POST   | `/prosim`            | CADASTRAR |
| GET    | `/prosim/:idpro`     | LISTAR    |
| GET    | `/prosim/:idpro/:id` | OBTER     |
| PUT    | `/prosim/:idpro/:id` | ALTERAR   |
| DELETE | `/prosim/:idpro/:id` | DELETAR   |

```bash
### Exemplo de JSON para cadastro/alteração de produto similar:
{
  "id_produto": 10,
  "descproduto": "Catalisador Corolla 1.8 – Similar",
  "id_modelo": 3,
  "id_marca": 5,
  "id_pessoa": 22,
  "ativo": "S"
}
```