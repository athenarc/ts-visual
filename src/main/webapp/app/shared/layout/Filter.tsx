import React, {useState} from "react";
// types
import {
  Builder,
  BuilderProps,
  Config,
  ImmutableTree,
  JsonGroup,
  Query,
  Utils as QbUtils
} from "react-awesome-query-builder";

import MaterialConfig from "react-awesome-query-builder/lib/config/material";
import "react-awesome-query-builder/lib/css/styles.css";
import "react-awesome-query-builder/lib/css/compact_styles.css"; // optional, for more compact styles

// Choose your skin (ant/material/vanilla):
const InitialConfig = MaterialConfig; // or MaterialConfig or BootstrapConfig or BasicConfig

export interface IFilterProps {
  columns: string[],
  filters: any[],
}


// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue: JsonGroup = {id: QbUtils.uuid(), type: "group"};

export const Filter = (props: IFilterProps) => {
  const {columns} = props;

  const createConfig = () => {
    const fields = {};
    for (let i = 0; i < columns.length; i++) {
      fields[columns[i]] = {
        "label": columns[i],
        "type": "number",
        valueSources: ["value"],
        preferWidgets: ["number"]
      };
    }
    return fields;
  }
  const config: Config = {
    ...InitialConfig,
    fields: createConfig()
  };

  const [state, setState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config
  });

  const onChange = (immutableTree: ImmutableTree, conf: Config) => {
    setState({tree: immutableTree, config: conf});

    const jsonTree = QbUtils.getTree(immutableTree);
  };

  const renderBuilder = (p: BuilderProps) => (
    <div className="query-builder-container" style={{padding: "10px"}}>
      <div className="query-builder">
        <Builder {...p} />
      </div>
    </div>
  );

  return (
    <div>
      <Query
        {...config}
        value={state.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
    </div>
  );
};

export default Filter;
