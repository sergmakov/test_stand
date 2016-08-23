export default {
  getPartOfSpeech: (token) => {
    return  token && token.partOfSpeech && token.partOfSpeech.tag;
  },
  getReferenceType: (token) => {
    return  token && token.dependencyEdge && token.dependencyEdge.label;
  },
  getReferencedIdx: (token) => {
    return  token && token.dependencyEdge && token.dependencyEdge.headTokenIndex;
  }
}
