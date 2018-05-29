import _ from "lodash";
import RNFetchBlob from "react-native-fetch-blob";

export default function exportData(tree){
	// RNFetchBlob.fs.createFile(RNFetchBlob.fs.dirs.DownloadDir + "/New.txt", "foo", "utf8");
	handleSession(tree);
	_.each(tree.forms, (form) => handleForm(form));
}

function handleSession(session){
	let output = [];
	let headers = ["Date", "Forms", "Guardians", "DOH", "ECBI"];
	let i = 0;
	const { date, forms, guardians, daysofhomework, ecbiscores } = session;

	output.push(headers);
	let defined = [forms, guardians, daysofhomework, ecbiscores].map((field) => checkDefined(field, i));
	while (defined.some((boolean) => boolean)) {
		let row = [];
		// Date
		row.push(i === 0 ? date : "");
		// Forms
		row.push(defined[0] ? forms[i].type : "");
		// Guardians
		row.push(defined[1] ? guardians[i].name : "");
		// Days of Homework
		row.push(defined[2] ? daysofhomework[i].Days : "");
		// ECBI
		row.push(defined[3] ? `I: ${ecbiscores[i].Intensity}, P: ${ecbiscores[i].Problem}` : "");

		output.push(row);
		i += 1;
		defined = [forms, guardians, daysofhomework, ecbiscores].map((field) => checkDefined(field, i));
	}
	console.log(output);
}

function handleForm(form){
	let headers = ["Type"];
	let values = [form.type];
	switch(form.type){
		case "PDI":
			handlePDI(form);
			break;
		default:
			handleDefault(form);
	}

	function handlePDI(form){
		_.each(form.sequences, (sequence, index) => {
			let field_list = [];
			_.each(sequence.fields, (field) => {
				if (index === "0") headers.push(field.name);
				field_list.push(field.value);
			});
			values.push(field_list);
		});
	}
	function handleDefault(form){
		_.each(form.fields, (field) => {
			headers.push(field.name);
			values.push(field.value);
		});
	}
	console.log([headers, values]);
}

function checkDefined(field, index){
	console.log("checkDefined", index);
	return (typeof field[index] !== "undefined");
}

function arrayFill(quantity){
	return Array(quantity).fill("");
}
