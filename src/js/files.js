//GESTION DES FICHIERS

function errorHandler(e) {
  console.log('Error: ' + e.name + '/'+ e.message);
}

function testFile(objmess) {
  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  function onInitFs(fs) {
    console.log('Testing file...');

    fs.root.getFile('log.txt', 
      {create: false}, 
      function(fileEntry) { 
        console.log('File exists !');
        objmess.innerHTML = "Data file exists",
        fileEntry.createWriter(
          function(fileWriter) { objmess.innerHTML += " size "+fileWriter.length }, 
          function(fileEntry) { objmess.innerHTML += " but failed to create writer ? "}
        );
      }, 
      function(fileEntry) {objmess.innerHTML = "Data file does not exist"}
    );

  }
  window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
}

//Marche uniquement dans chorme si on a joute en plus --allow-file-access-from-files pour le local
function saveToFile(user,app,diff,win,mise){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	function onInitFs(fs) {
  	//console.log('Opened file system for save: ' + fs.name);

		fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.seek(fileWriter.length); // Start write position at EOF.

      // Create a new Blob and write it to log.txt.
      var blob = new Blob([user+';'+app+';'+diff+';'+win+';'+mise+"\n"], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);

	}
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
}

//Marche uniquement dans chorme si on a joute en plus --allow-file-access-from-files pour le local
function showFile(){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	function onInitFs(fs) {
		fs.root.getFile('log.txt', {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         var txtArea = document.createElement('textarea');
         txtArea.value = this.result;
         document.body.appendChild(txtArea);
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);

	}
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
}

function createFile(){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	function onInitFs(fs) {
  	console.log('Opened file system for create: ' + fs.name);

		fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {
      console.log('File created.');
			var blob = new Blob(["nom;app;diff;win;mise\n"], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);

	}
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
}

function deleteFile(){
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	function onInitFs(fs) {
  	console.log('Opened file system for delete: ' + fs.name);

		fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

	    fileEntry.remove(function() {
	      console.log('File removed.');
	    }, errorHandler);

	  }, errorHandler);

	}
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, onInitFs, errorHandler);
}
