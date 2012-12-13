function dice(min, max, times) {
  times = times || 1;
  var sum = 0,
      range = max - min,
      t = times;
  while(t--) {
    sum += Math.random();
  }
  return Math.round((range * (sum / times)) + min);
}

function shuffle(array) {
  var tmp, current, top = array.length;

  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }

  return array;
}