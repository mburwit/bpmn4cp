import observation from './implementation/Observation';

export default function(group, element, bpmnFactory, translate) {
  const observationEntry = observation(element, bpmnFactory, {}, translate);
  group.entries = group.entries.concat(observationEntry.entries);
  return {
    getSelectedObservation: observationEntry.getSelectedObservation,
  };
}
