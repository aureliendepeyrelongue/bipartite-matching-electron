import { v4 as uuidv4 } from "uuid";
import { constantCase } from "constant-case";
import removeAccents from "remove-accents";

const NA_SYMBOL = "N/A";
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

  setProjectName(projectName) {
    this.base.name = projectName;
  }

  setMatchingResult(matchingProcessResult) {
    let finalPairsColumns = [],
      finalPairs = [];

    this.base.tables.tableA.columns.forEach((c) => {
      finalPairsColumns.push(c.origin);
    });

    this.base.tables.tableB.columns.forEach((c) => {
      if (!finalPairsColumns.includes(c.origin))
        finalPairsColumns.push(c.origin);
    });

    matchingProcessResult.couples.forEach((couple, index) => {
      let menteeLine = {};
      for (let name in couple.mentee) {
        const col = this.base.tables.tableA.columns.find(
          (c) => "aa:" + c.target === name
        );
        menteeLine[col.origin] = couple.mentee[name];
      }

      let mentorLine = {};
      for (let name in couple.mentor) {
        const col = this.base.tables.tableB.columns.find(
          (c) => "bb:" + c.target === name
        );
        mentorLine[col.origin] = couple.mentor[name];
      }

      let fMenteeLine = {},
        fMentorLine = {};
      finalPairsColumns.forEach((fpc) => {
        fMenteeLine[fpc] =
          menteeLine[fpc] !== undefined ? menteeLine[fpc] : NA_SYMBOL;
        fMentorLine[fpc] =
          mentorLine[fpc] !== undefined ? mentorLine[fpc] : NA_SYMBOL;
      });
      let pIndex = index + 1;
      finalPairs.push({ ...{ Pair_ID: pIndex }, ...fMenteeLine });
      finalPairs.push({ ...{ Pair_ID: pIndex }, ...fMentorLine });
    });

    let rejectedA = [];
    matchingProcessResult.discharges.mentees.forEach((mentee) => {
      let menteeLine = {};
      for (let name in mentee) {
        const col = this.base.tables.tableA.columns.find(
          (c) => "aa:" + c.target === name
        );
        menteeLine[col.origin] = mentee[name];
      }
      rejectedA.push(menteeLine);
    });

    let rejectedB = [];
    matchingProcessResult.discharges.mentors.forEach((mentor) => {
      let mentorLine = {};
      for (let name in mentor) {
        const col = this.base.tables.tableB.columns.find(
          (c) => "bb:" + c.target === name
        );
        mentorLine[col.origin] = mentor[name];
      }
      rejectedB.push(mentorLine);
    });

    this.base.matchingResult = {
      pairs: finalPairs,
      pairsColumns: ["Pair_ID", ...finalPairsColumns],
      rejectedA,
      rejectedB,
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

  deleteConstraint(id) {
    const toRemove = this.base.constraints.find((c) => c.id === id);
    const index = this.base.constraints.indexOf(toRemove);
    if (index > -1) this.base.constraints.splice(index, 1);
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
