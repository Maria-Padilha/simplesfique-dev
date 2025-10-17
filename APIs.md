# 🌐 URLs E APIs

## URLs
URL do backend não definitiva.
```plaintext
IP: 192.168.10.5
PORT: 9005
URL BASE: http://192.168.10.5:9005/
```

## APIs

Baixar a collection do Insomnia para testar as APIs:

[simplesfique-collection](..%2F..%2Fsimplesfique-collection) <br>
[simplesfique-collection.yaml](..%2F..%2Fsimplesfique-collection.yaml)

```plaintext
Content-Type: application/json 
Bearer Token (para rotas que necessitam de autenticação)
``` 

### Empresas:

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
  "data": {
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
    "id_atividade": 5,
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
  }
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
  "data": {
    "nome": "Bonfire SAAS Raiz",
    "email": "admin@bonfire.com",
    "telefone": "65998765432",
    "dh_cadastro": "2025-10-16T14:00:00",
    "ativo": "S"
  }
}
```

### País:

| Método | Endpoint | Descrição                               |
|--------|---------|-----------------------------------------|
| **POST** | `/pais` | Cadastrar país — passar um JSON `"data"` |
| **GET** | `/pais` | Retorna todos os países                 |
| **GET** | `/pais/:id` | Retornar dados do país                  |
| **PUT** | `/pais/:id` | Alterar dados do país                   |
| **DELETE** | `/pais/:id` | Excluir país                            |

```bash
### Exemplo de JSON para cadastro/alteração de país:
{
  "data": {
    "id": 1
    "nomepais": "Brasil",
  }
}
```

### UF:

| Método | Endpoint | Descrição                             |
|--------|-------|---------------------------------------|
| **POST** | `/uf` | Cadastrar UF — passar um JSON `"data"` |
| **GET** | `/uf` | Retorna todas as UFs                  |
| **GET** | `/uf/:id` | Retornar dados da UF                  |
| **PUT** | `/uf/:id` | Alterar dados da UF                   |
| **DELETE** | `/uf/:id` | Inativar / excluir UF                 |

```bash
### Exemplo de JSON para cadastro/alteração de UF:
{
  "data": {
    "id": 1
    "sigla": "MT",
    "descuf": "Mato Grosso",
    "id_pais": 1,
  }
}
```

### Cidade:

| Método | Endpoint | Descrição                                 |
|--------|-----------|-------------------------------------------|
| **POST** | `/cidade` | Cadastrar cidade — passar um JSON `"data"` |
| **GET** | `/cidade` | Retorna todas as cidades                  |
| **GET** | `/cidade/:id` | Retornar dados da cidade                  |
| **PUT** | `/cidade/:id` | Alterar dados da cidade                   |
| **DELETE** | `/cidade/:id` | Excluir cidade                            |

```bash
### Exemplo de JSON para cadastro/alteração de cidade:
{
  "data": {
    "id": 1
    "descidade": "Cuiabá",
    "id_uf": 1,
    "ddd": "65"
  }
}
```

### Feriado:

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
  "data": {
    "id": 1
    "descferiado": "Natal",
    "dia_feriado": "2025-12-25",
    "tipo_feriado": "Nacional",
    "id_cidade": null,
  }
}
```

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
  "data": {
    "id": 1
    "descatividade": "Desenvolvimento de Software",
  }
}
```

### Pessoa: 

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
  "data": {
    "id": 1
    "descclassepessoa": "Cliente",
  }
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
  "data": {
    "id": 1
    "descdepartamento": "Recursos Humanos",
  }
}
```

### Pessoa: 

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
  "data": {
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
  }
}
```

### CEP:

| Método  | Endpoint | Descrição              |
|---------|--------|------------------------|
| **GET** | `/cep` | retornar todos os ceps |
| **GET** | `/cep/:id` | retornar dados do cep  |