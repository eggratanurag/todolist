export default function myday() {
	var today = new Date();

	var options = {
		weekday: 'long',
	}

	var day = today.toLocaleDateString("en-us", options);
  return day;
}