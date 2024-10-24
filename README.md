
**Application 1: Rule Engine with AST**  
Zeotap | Software Engineer Intern | Assignment | Application 1

### Applicant Introduction  
Hello! I'm Subhodeep Manna, a Full-Stack Developer and AI enthusiast proficient in React, Next.js, Django, and machine learning. Currently, I'm engaged in projects such as a College Directory App and a Seat Booking System, and I'm always excited to learn and innovate! 

### Table of Contents  
- Introduction  
- Technical Aspects  
- Installation  
- Running the Application  
- About the Solution  
- Solution Overview  
- Code Structure  
- Non-Technical Aspects  
- My Approach  
- Feedback  
- Conclusion  

### Introduction  
I've thoroughly reviewed the assignment description multiple times to ensure I capture all the important details.

Most of the code I've written tells a story, so I made an effort to keep the README clear and concise. Here are the key points:

- The code is extensively commented and includes appropriate docstrings (React code is compatible with Doxygen, and Python code with Sphinx).
- Unit tests cover all edge cases, incorporating both positive and negative scenarios. Coverage is maintained above 80%.
- This README will first discuss the technical aspects, followed by the solution overview. Lastly, I'll touch on various miscellaneous topics, which, while technical, are categorized as "non-technical." They reflect my thought process and approach to the solution, along with a brief discussion on design.

### Technical Aspects  

#### Installation  
I have made every effort to ensure the application is platform-agnostic, packaging everything into a Docker container. However, you can run the components separately on your machine without Docker by following the steps below.

**Frontend**  
```bash
cd frontend/
npm install
```

**Backend**  
If you haven’t installed Poetry yet, please do so first:
```bash
python3 -m venv $VENV_PATH
$VENV_PATH/bin/pip install -U pip setuptools
$VENV_PATH/bin/pip install poetry
```
Next, create a virtual environment and install dependencies:
```bash
cd backend/
poetry install
```

**Database**  
After installing Poetry, execute the following command to set up the initial data in your Postgres instance. Make sure to configure the connection credentials in the `.env` file.
```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

### Running the Application  
Assuming the above installation process was successful, you can run the following commands:

**Frontend**  
```bash
npm run dev
```

**Backend**  
```bash
poetry run python main.py --dev
```

**Database**  
```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

### About the Solution  
The solution consists of a UI, an API, and a database. For the UI, I chose Next.js since I am most familiar with it. The API is built using FastAPI due to its speed, both in development and post-deployment. System performance is my top priority, closely followed by developer productivity.

### Solution Overview  
The solution is straightforward. Here are some key points:

- The UI makes HTTP requests to the REST API and visualizes the AST using `react-d3-tree`.
- The backend processes the input string by first tokenizing it using `tokenizer()`. A specified regex identifies lexemes during tokenization. Then, it parses the token stream using a `Parser` object, resulting in an AST node.
- We serialize the AST to JSON format for storage in the database. While there are more efficient methods, such as hashing the Node object for a key-value store, I opted for this approach for simplicity. This allows for tree traversal during updates, saving only modified nodes. We can associate dynamic pointers with each Node to optimize space, storing similar conditions once and linking them through pointers. This is akin to how Dropbox manages file storage.

### Code Structure  
This section outlines the files and their purposes.

**Backend**

| File Path                          | Description                                    |
|------------------------------------|------------------------------------------------|
| `main.py`                          | Entry point for the server                    |
| `poetry.lock`                     | Server dependencies managed by Poetry         |
| `pyproject.toml`                  | Py Project Metadata                            |
| `rule_engine/ast_utils.py`        | Class definitions and utility functions for AST, including Node |
| `rule_engine/database.py`         | ORM and functions for database interactions    |
| `rule_engine/main.py`             | API entry point containing API contracts       |
| `rule_engine/models.py`           | Database table schema                          |
| `rule_engine/parser_utils.py`     | Definitions and utilities for parser and tokenizer |

**Frontend**

| File Path                            | Description                                   |
|--------------------------------------|-----------------------------------------------|
| `app/`                               | Source code for the application               |
| `app/components/ASTTree.tsx`        | Component for visualizing the AST             |
| `app/services/api.ts`               | Middleware/utility to connect to REST API     |
| `app/page.tsx`                      | Entry point for the UI, rendering the main page |

### Design Discussion  
#### Low-Level Design of Classes:

**Class Node**  
- Attribute `node_type`: String (either "operand" or "operator")
- Attribute `left`: Node
- Attribute `right`: Node
- Attribute `value`: Condition or Operator

**Class Operator**  
- Method `evaluate(left: Node, right: Node) -> Boolean`

**Class ANDOperator (inherits Operator)**  
- Method `evaluate(left: Node, right: Node) -> Boolean`  
  `return left.value.evaluate() AND right.value.evaluate()`

**Class OROperator (inherits Operator)**  
- Method `evaluate(left: Node, right: Node) -> Boolean`  
  `return left.value.evaluate() OR right.value.evaluate()`

**Generic Type T**  
**Class Condition<T>**  
- Attribute `lvariable`: String  
- Attribute `rvalue`: T  
- Attribute `comparison_type`: String (options include "gt", "lt", "eq", "lteq", "gteq", "neq")  

- Method `evaluate(input_value: T) -> Boolean`:  
  - If `comparison_type == "gt"`: return `input_value > rvalue`  
  - If `comparison_type == "lt"`: return `input_value < rvalue`  
  - If `comparison_type == "eq"`: return `input_value == rvalue`  
  - If `comparison_type == "lteq"`: return `input_value <= rvalue`  
  - If `comparison_type == "gteq"`: return `input_value >= rvalue`  
  - If `comparison_type == "neq"`: return `input_value != rvalue`  

**Class AST**  
- Attribute `root`: Node  

- Method `evaluate_rule(json_data: Dictionary) -> Boolean`:  
  `return _evaluate_node(root, json_data)`  

- Method `_evaluate_node(node: Node, data: Dictionary) -> Boolean`:  
  - If `node.node_type == "operand"`: return `node.value.evaluate(data[node.value.lvariable])`  
  - If `node.node_type == "operator"`: return `node.value.evaluate(node.left, node.right)`  

- Method `create_rule(rule: String) -> Boolean`:  
  `tokens = tokenize(rule)`  
  `parser = Parser(tokens)`  
  `root = parser.parse()`  
  `return True`  

- Function `combine_rules(rules: List<String>) -> Boolean`:  
  - Step 1: Parse each rule into its AST form  
    - Attribute `asts: List<Node> = []`  
    - For each `rule` in `rules`:  
      - `tokens = tokenize(rule)`  
      - `parser = Parser(tokens)`  
      - `asts.append(parser.parse())`  

  - Step 2: Determine the most frequent operator  
    - Attribute `operator_count: Dictionary<String, Integer> = {'AND': 0, 'OR': 0}`  
    - For each `rule` in `rules`:  
      - `operator_count['AND'] += count_occurrences(rule, 'AND')`  
      - `operator_count['OR'] += count_occurrences(rule, 'OR')`  

    - Attribute `most_frequent_operator: String`  
      - If `operator_count['AND'] >= operator_count['OR']`:  
        `most_frequent_operator = 'AND'`  
      - Else:  
        `most_frequent_operator = 'OR'`  

    - Attribute `operator_class: Class`  
      - If `most_frequent_operator == 'AND'`:  
        `operator_class = ANDOperator`  
      - Else:  
        `operator_class = OROperator`  

  - Step 3: Combine all ASTs using the most frequent operator  
    - While `length(asts) > 1`:  
      - `left_ast = asts.pop(0)`  
      - `right_ast = asts.pop(0)`  
      - `combined_ast = Node(node_type="operator", left=left_ast, right=right_ast, value=operator_class())`  
      - `asts.append(combined_ast)`  

    - `root = asts[0]`  
    - Return `True`  

#### Parser and Tokenizer

- Function `tokenize(rule: String) -> List<String>`:  
  `token_pattern = compile_regex('\s*(=>|<=|>=|&&|\|\||[()=><!]|[\w]+)\s

*')`  
  `return [match.group() for match in token_pattern.finditer(rule)]`  

- Class `Parser`:  
  - Method `parse()`:  
    - Implementation to process tokens into an AST  

### Non-Technical Aspects  

#### Thought Process  
To foster creativity, I wrote down every thought that crossed my mind. Following a clear flow of thought helped me avoid confusion and encouraged the generation of more ideas. Documenting this process is beneficial for future reference.

#### Learnings  
1. **Code Readability**: Documentation is crucial; writing good docstrings and comments will assist others in understanding the project.
2. **Separation of Concerns**: Adhering to this principle helps maintain clean code.

### Feedback  
I'd appreciate any feedback you may have regarding the code, approaches, or overall design.

### Conclusion  
Thank you for taking the time to review my submission.
