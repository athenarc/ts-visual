import React, { useEffect, useState } from "react";
import { alpha, styled } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from '@mui/icons-material/Logout';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeItemProps } from "@mui/x-tree-view/TreeItem";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Link, useHistory } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "app/modules/store/storeConfig";
import { updateDatasetChoice, resetFetchData, disconnector } from "app/modules/store/visualizerSlice";

interface ISelectedDataset {
    schema: string;
    table: string;
}

const defaultSelectedDataset: ISelectedDataset = {
    schema: '',
    table: '',
}

const CustomTreeItem = React.forwardRef(
    (props: TreeItemProps, ref: React.Ref<HTMLLIElement>) => (
        <TreeItem {...props} ref={ref} />
    ),
);
  
const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));
  

const VisControlDatasetSelection = ({setDatasetIsSelected}) => {
    const [selectedDataset, setSelectedDataset] = useState<ISelectedDataset>(defaultSelectedDataset);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>('');


    const dispatch = useAppDispatch();
    const { schemaMeta, datasetChoice} = useAppSelector(state => state.visualizer);
    
    useEffect(() => {
        if (selectedDataset.table) {
            const idx = schemaMeta.data.findIndex(file => file.schema === selectedDataset.schema && file.id === selectedDataset.table);
            if (datasetChoice !== idx)
                dispatch(updateDatasetChoice(idx));
            setDatasetIsSelected(true);
        }
    },[selectedDataset.table]);

    const selectedDatasetChange = (schema, table) => {
        setSelectedDataset(prevDataset => (
            {...prevDataset,
                schema: schema,
                table: table}
        ));
    }

    const handleDataset = (dataset) => {
        const idx = schemaMeta.data.findIndex(file => file.schema === dataset.schema && file.id === dataset.id);
        if (datasetChoice !== idx) {
            dispatch(updateDatasetChoice(idx));
        }
    };

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event: React.SyntheticEvent, nodeIds: string) => {
        setSelected(nodeIds);
    };
    
    

    return (
        <Grid sx={{width: "100%", height: "100%"}} >
            <Typography variant="h6" gutterBottom>
                Upload Dataset
            </Typography>
            <Grid item>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    expanded={expanded}
                    selected={selected}
                    onNodeToggle={handleToggle}
                    onNodeSelect={handleSelect}
                    multiSelect={false}
                >   
                    <StyledTreeItem
                        nodeId={schemaMeta.name}
                        label={schemaMeta.name}
                    >
                        {schemaMeta.data.map(file => file.schema).filter(
                            (schema, idx, curr_schema) => curr_schema.indexOf(schema) === idx).map(schema => 
                            (<StyledTreeItem nodeId={`schema-${schema}`} key={schema} label={schema}>
                                {schemaMeta.data.filter(file => file.schema === schema && !file.isConfiged).map((file, idx) => (
                                    <StyledTreeItem
                                        nodeId={`table-${schema}-${file.id}`}
                                        key={idx}
                                        label={file.id}
                                        onClick={() => {selectedDatasetChange(schema,file.id)}}
                                        icon={<TableChartOutlinedIcon/>}
                                    />
                                ))}
                                </StyledTreeItem>)
                        )}
                    </StyledTreeItem>
                </TreeView>
            </Grid>
            <Grid item>
                {(schemaMeta.data.filter( file => file.isConfiged).length > 0) && 
                    <Typography variant="h6" gutterBottom>
                        Configured Datasets
                    </Typography>
                }
                <List disablePadding dense>
                    {schemaMeta.data.filter( file => file.isConfiged).map((file, idx) => (
                    <ListItemButton
                        key={idx}
                        component={Link}
                        to={`/visualize/${file.schema}/${file.id}`}
                        onClick={() => {
                            handleDataset(file);
                        }}
                        divider
                    >
                        <ListItemText primary={`${file.id}`} />
                    </ListItemButton>
                    ))}
                    <ListItemButton key={'close-connection-list-button-sd'}
                        component={Link}
                        to={`/visualize`}
                        onClick={() => {dispatch(resetFetchData());dispatch(disconnector({}));}}
                    >
                        <ListItemText primary={`Close Connection`} sx={ {display: { xs: 'none', md: 'block' }}} />
                        <LogoutIcon />
                    </ListItemButton>
                </List>
            </Grid>
        </Grid>
    );
}

export default VisControlDatasetSelection;