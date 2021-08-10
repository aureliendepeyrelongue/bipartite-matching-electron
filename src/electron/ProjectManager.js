import { v4 as uuidv4 } from "uuid";
import { constantCase } from "constant-case";
import { normalize } from "normalize-diacritics";
import removeAccents from "remove-accents";

class ProjectManager {
  constructor(projectName) {
    this.createProject(projectName);
  }

  createProject(projectName) {
    this.base = {
      name: projectName,
      tables: {
        tableA: {
          empty: true,
          columns: [],
        },
        tableB: {
          empty: true,
          columns: [],
        },
      },
      constraints: [],
      matchingResult: {
        pairs: [],
        rejectedA: [],
        rejectedB: [],
      },
    };
  }

  setTable(tableType, location, data) {
    if (this.isValidTableType(tableType)) {
      this.base.tables[`table${tableType}`].empty = false;
      this.base.tables[`table${tableType}`].location = location;
      this.base.tables[`table${tableType}`].data = data;
      if (data.length) {
        const firstLine = data[0];
        this.base.tables[`table${tableType}`].columns = [];
        for (let name in firstLine) {
          this.base.tables[`table${tableType}`].columns.push({
            origin: name,
            target: constantCase(removeAccents(name)),
            type: "string",
          });
        }
      }
    } else {
      throw new Error("Unknown table type", type);
    }
  }

  isValidTableType(tableType) {
    return tableType === "A" || tableType === "B";
  }

  updateColumns(tableType, columns) {
    this.base.tables[`table${tableType}`].columns = columns;
  }

  deleteColumnTarget(tableType, id, origin) {
    if (this.isValidTableType(tableType)) {
      this.base.tables[`table${tableType}`].columns = this.base.tables[
        `table${tableType}`
      ].columns.filter((el) => el.origin !== el.origin);
    } else {
      throw new Error("Unknown table type", type);
    }
  }

  addTableConstant(tableType, key, value) {
    if (this.isValidTableType(tableType)) {
      const constant = {
        id: uuidv4(),
        key: constantCase(removeAccents(key)),
        value,
      };
      this.base.tables[`table${tableType}`].constants.push(constant);
      return constant;
    } else {
      console.log(tableType);
      throw new Error("Unknown table type", tableType);
    }
  }

  updateTableConstant(tableType, id, key, value) {
    if (this.isValidTableType(tableType)) {
      const constant = this.base.tables[`table${tableType}`].constants.find(
        (el) => el.id === id
      );
      if (constant) {
        constant.key = key;
        constant.value = value;
      } else {
        throw new Error("Constant not found.", key);
      }
    } else {
      throw new Error("Unknown table type", type);
    }
  }

  deleteTableConstant(tableType, id) {
    if (this.isValidTableType(tableType)) {
      this.base.tables[`table${tableType}`].constants = this.base.tables[
        `table${tableType}`
      ].constants.filter((el) => el.id !== id);
    } else {
      throw new Error("Unknown table type", type);
    }
  }

  addConstraint(name, type, weight, content, description) {
    this.base.constraints.push({
      id: uuidv4(),
      name,
      type,
      weight,
      content,
      description,
    });
  }

  updateConstraint(id, name, type, weight, content, description) {
    const constraint = this.base.constraints.find((el) => el.id === id);
    if (constraint) {
      constraint.name = name;
      constraint.type = type;
      constraint.weight = weight;
      constraint.content = content;
      constraint.description = description;
    } else {
      throw new Error("Constraint not found.", name);
    }
  }

  deleteConstraint(id) {
    this.base.constraints = this.base.constraints.filter((el) => el.id !== id);
  }
}

export default ProjectManager;
