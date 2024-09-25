import React, {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useAppDispatch, useAppSelector} from "app/modules/store/storeConfig";
import VisMeasuresList from "app/modules/visualizer/vis-control/measures/vis-measures-list";
import {updateCustomSelectedMeasures, updateQueryResults} from "app/modules/store/visualizerSlice";

const CustomMeasureModal = ({ open, onClose }) => {
  const [selectedMeasure1, setSelectedMeasure1] = useState('');
  const [selectedMeasure2, setSelectedMeasure2] = useState('');
  const { dataset, schemaMeta, from, to, viewPort, selectedMeasures, filter, customSelectedMeasures } = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();

  let indexes = [dataset.header.indexOf(dataset.timeCol)];
  const shownMeasures = dataset.header.filter(function (value, index) {
    return indexes.indexOf(index) === -1;
  });

  const handleSelectedMeasure1 = (event, value) => {
    const id = dataset.header.indexOf(value);
    if (id !== -1) {
      setSelectedMeasure1(value);
    }
  }

  const handleSelectedMeasure2 = (event, value) => {
    const id = dataset.header.indexOf(value);
    if (id !== -1) {
      setSelectedMeasure2(value);
    }
  }

  const checkIfExists = () => {
    const id1 = dataset.header.indexOf(selectedMeasure1);
    const id2 = dataset.header.indexOf(selectedMeasure2);
    if(id1 == -1 || id2 == -1) return false;
    return customSelectedMeasures.some(obj => obj.measure1 === id1 && obj.measure2 === id2);
  }

  const handleSave = () => {
    // Handle the selected measures and create your custom measure
    // You may want to pass this data back to your main component
    // or perform the calculation here.
    // Example: const customMeasure = selectedMeasure1 / selectedMeasure2;
    const id1 = dataset.header.indexOf(selectedMeasure1);
    const id2 = dataset.header.indexOf(selectedMeasure2);
    dispatch(updateCustomSelectedMeasures([...customSelectedMeasures, {measure1: id1, measure2: id2}]));
    dispatch(
      updateQueryResults({ schema: schemaMeta.name, id: dataset.id,
        from: from ? from : dataset.timeRange.to - (dataset.timeRange.to - dataset.timeRange.from) * 0.1,
        to: to ? to : dataset.timeRange.to, viewPort, selectedMeasures, filter })
    );
    // Close the modal
    onClose();
  };

  return (
    <Dialog open={open}
            maxWidth="sm" fullWidth={true}
            onClose={onClose}>
      <DialogTitle>Create Custom Measure</DialogTitle>
      <DialogContent>
        {/* Dropdowns for selecting measures */}
        <Typography variant="subtitle1" color="textSecondary">
          Select the measures for the ratio:
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <VisMeasuresList
            width={"45%"}
            onChange={handleSelectedMeasure1}
            value={selectedMeasure1}
            options={shownMeasures}
            disabled={false}
          />
          <Typography variant="subtitle1" color="textSecondary">
            ÷
          </Typography>
          <VisMeasuresList
            width={"45%"}
            onChange={handleSelectedMeasure2}
            value={selectedMeasure2}
            options={shownMeasures}
            disabled={false}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={checkIfExists() || selectedMeasure1 === '' || selectedMeasure2 === '' || (selectedMeasure2 == selectedMeasure1)}
          color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomMeasureModal;
