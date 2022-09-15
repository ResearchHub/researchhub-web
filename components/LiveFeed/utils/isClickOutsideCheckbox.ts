export default function isClickOutsideCheckbox(event, ignoreElems: Array<any> = []){
  const checkboxes = Array.from(document.querySelectorAll(".cbx"));

  for (let i=0; i < checkboxes.length; i++) {
    const cbxEl = checkboxes[i];
    if (cbxEl.contains(event.target) || cbxEl === event.target) {
      return false;
    }
  }

  for (let i=0; i < ignoreElems.length; i++) {
    const ignoreEl = ignoreElems[i];
    if (!ignoreEl) continue;
    if (ignoreEl.contains(event.target) || ignoreEl === event.target) {
      return false;
    }
  }

  return true;
}