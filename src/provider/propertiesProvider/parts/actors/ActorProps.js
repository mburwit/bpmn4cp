import actor from './Actor';

export default function(group, element, bpmnFactory, translate) {
  const actorEntry = actor(element, bpmnFactory, {}, translate);
  group.entries = group.entries.concat(actorEntry.entries);
  return {
    getSelectedActor: actorEntry.getSelectedActor,
  };
}
