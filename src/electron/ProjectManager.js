import { v4 as uuidv4 } from "uuid";
import { constantCase } from "constant-case";
import { normalize } from "normalize-diacritics";
import removeAccents from "remove-accents";

class ProjectManager {
  constructor() {
    this.base = {
      tables: {
        tableA: {
          empty: true,
        },
        tableB: {
          empty: true,
        },
      },
      constraints: [
        {
          name: "age",
          type: "necessary",
          value: "mentee.age < mentor.age",
          tokens: [],
          description: "",
        },
        {
          name: "JobLevel",
          type: "secondary",
          value: "mentee.joeb_level = mentor.job_level",
          tokens: [],
          description: "",
        },
      ],
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
        this.base.tables[`table${tableType}`].columnNames = [];
        for (let name in firstLine) {
          this.base.tables[`table${tableType}`].columnNames.push({
            origin: name,
            target: constantCase(removeAccents(name)),
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

  addColumnTarget(tableType, origin, target) {
    if (this.isValidTableType(tableType)) {
      this.base.tables[`table${tableType}`].columnNames.push({
        id: uuidv4(),
        origin,
        target,
      });
    } else {
      throw new Error("Unknown table type", type);
    }
  }

  updateColumnTarget(tableType, id, origin, target) {
    if (this.isValidTableType(tableType)) {
      const column = this.base.tables[`table${tableType}`].columnNames.find(
        (el) => el.id === id
      );
      if (column) {
        column.target = target;
        column.origin = origin;
      } else {
        throw new Error("Column not found", origin);
      }
    } else {
      throw new Error("Unknown table type", type);
    }
  }

  deleteColumnTarget(tableType, id, origin) {
    if (this.isValidTableType(tableType)) {
      this.base.tables[`table${tableType}`].columnNames = this.base.tables[
        `table${tableType}`
      ].columnNames.filter((el) => el.origin !== el.origin);
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

  addConstraint(name, type, content, tokens, description) {
    this.base.constraints.push({
      id: uuidv4(),
      name,
      type,
      content,
      tokens,
      description,
    });
  }

  updateConstraint(id, name, type, content, tokens, description) {
    const constraint = this.base.constraints.find((el) => el.id === id);
    if (constraint) {
      constraint.name = name;
      constraint.type = type;
      constraint.content = content;
      constraint.tokens = tokens;
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
