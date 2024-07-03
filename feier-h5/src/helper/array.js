const removeDuplicatesByPop = (myArr, prop) =>
  myArr.filter(
    (obj, pos, arr) =>
      arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  );

export { removeDuplicatesByPop };
