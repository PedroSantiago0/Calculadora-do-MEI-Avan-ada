# Calculadora do MEI (Avançada)

Descrição
---------

Aplicação web simples para cálculos relacionados ao MEI (Microempreendedor Individual).
A interface principal está em [index.html](index.html) e a lógica em [js/script.js](js/script.js).

Estrutura do projeto
--------------------

- [index.html](index.html) — página principal
- [css/style.css](css/style.css) — estilos
- [js/script.js](js/script.js) — scripts da aplicação
- [k6/load-test.js](k6/load-test.js) — teste de carga com k6
- [resultado.json](resultado.json) — exemplo/resultado de teste de carga

Pré-requisitos
--------------

- Navegador moderno (Chrome, Firefox, Edge)
- Opcional: `k6` instalado para executar testes de carga

Instalação e execução
---------------------

1. Abrir a página localmente:

   - Método simples: abrir [index.html](index.html) diretamente no navegador.

   - Servidor local (recomendado para evitar restrições de CORS):

```bash
# Com Python 3
python -m http.server 8000
# Ou (Windows) se `python` não estiver no PATH
py -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

Uso
---

- Preencha os campos na interface e clique no botão para calcular.
- Os resultados são mostrados na própria página.

Testes de carga
---------------

Se quiser rodar o teste de carga incluído com `k6` (opcional):

```bash
# Executa o teste definido em k6/load-test.js
k6 run k6/load-test.js

# Para salvar a saída em JSON (ex.: resultado.json)
k6 run --out json=resultado.json k6/load-test.js
```

Contribuição
------------

- Sugestões e correções são bem-vindas. Abra um pull request ou issue com sua proposta.

Próximos passos sugeridos
------------------------

- Adicionar testes automatizados (unitários/integração)
- Incluir `LICENSE` com a licença desejada
- Configurar CI para lint/build

Licença
-------

Projeto com licença MIT (sinta-se à vontade para alterar conforme necessário).
