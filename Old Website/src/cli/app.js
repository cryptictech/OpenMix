$(document).ready(function(){
	//Cleans up server
	$( window ).on('unload', function(){
		$.ajax({
			url: 'src/svr/resmger.php',
			type: 'post'
		});
	});
	//Track tracker
	var tracks = {
		trackCount: 1,
		track: [{
			name: 'track-1',
			url: null,
			trackRef: 'track1',
			obj: null,
		},],
		stopped: true,
		playing: false,
		master: null,
		//This mashes all the tracks into the master track. For when you are about done.
		mash: function(){
			this.master = new Wad.Poly({
				env: {
					hold: 10000000
				},
				panning: 0,
				volume: 1,
				detune: 0,
				recConfig: {
					workerPath: 'src/cli/recorderWorker.js',
					type: 'audio/mpeg'
				},
			});

			for(i=0; i < this.trackCount; i++){
				this.master.add(this.track[i].obj);
			}
		},

		//Grabs the reference number based off of the tracks reference name.
		getByRef: function( ref ){
			for(i = 0; i < this.trackCount; i++){
				if(this.track[i].trackRef == ref){
					return i;
				}
			}
		}
	}

	//Validates URL
	//Reference: http://stackoverflow.com/questions/2838404/javascript-regex-url-matching
	var ValidURL = function(url) {
	  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
	  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	  return pattern.test(url);
	}

	var ValidFileFormat = function(url){
		var pattern = new RegExp('\.mp3|\.wav|\.ogg');
		return pattern.test(url);
	}

	var readImportData = function(){
		var url = $("#url").val();
		var selectedMode;
		var verifiedURL = false;

		//Check to make sure a radio button is selected.
		if($('#audio').is(":checked")){
			selectedMode = 'audio';
		}else if ($('#video').is(':checked')){
			selectedMode = 'video';
		}else {
			console.error("Nothing is checked in import form.")
		}

		//Check to make sure there is something in URL
		if( url != null && ValidURL(url) && ValidFileFormat(url)){
			if(tracks.trackCount == 1 && tracks.track[0].url == null){
				tracks.track[0].url = url;
				tracks.track[0].obj = new Wad({
					source: url,
					volume: 1.0,
					detune: 0,
					panning: 0,
					loop:false,
					env: {
						hold: 10000000
					}
				});
				$('#track1-URL').empty();
				$('#track1-URL').append(url);
			}else {
				tracks.trackCount += 1;
				tracks.track[ tracks.trackCount - 1 ] = {
					name: "track-" + tracks.trackCount,
					url: url,
					trackRef: "track" + tracks.trackCount,
					obj: new Wad({
						source: url,
						volume: 1.0,
						detune: 0,
						panning: 0,
						loop: false,
						env: {
							//This is an arbitrary number, because I doubt any music is 166,666 minutes.
							hold: 10000000
						}
					})
				};

				$('.table-track-manager tbody').append('<tr><td><input class="form-control" type="text" name="' + tracks.track[ tracks.trackCount - 1 ].name + '" value="' + tracks.track[tracks.trackCount - 1].name + '"></td><td class="inactive" id="track' + tracks.trackCount + '-URL">' + tracks.track[tracks.trackCount - 1].url + '</td></tr>');
				$('.table-track-controller tbody').append('<tr class="' + tracks.track[tracks.trackCount - 1].trackRef + '-controller"><td class="track-name"><span class="fa-stack play" id="' + tracks.track[tracks.trackCount - 1].trackRef + '-play"><i class="fa fa-circle fa-stack-2x" aria-hidden="true"></i><i class="fa fa-play fa-inverse fa-stack-1x" aria-hidden="true"></i></span> ' + tracks.track[tracks.trackCount - 1].name + '<td class="track-control ' + tracks.track[tracks.trackCount - 1].trackRef + '-volume"><input type="range" id="' + tracks.track[tracks.trackCount - 1].trackRef + '-volume" max="100" min="0" value="100"></td><td class="track-control track-panning"><input type="range" id="' + tracks.track[tracks.trackCount - 1].trackRef + '-panning" max="100" min="0" value="50"></td><td class="track-control track-detune"><input type="range" id="' + tracks.track[tracks.trackCount - 1].trackRef + '-detune" max="100" min="0" value="50"></td></td></tr>');
			}
			$('#url').val('');
		}else{
			alert("Please enter a valid URL with a valid file format.");
			$('#url').val('');
		}
	}

	//Be sure everything is hidden to start
	$("#videoURL").hide();
	$("#fileUpload").hide();

	//Set up forms to auto select the import form
	var activeElement = "import";
	$("#import-btn").addClass("active");
	$("#videoURL").show();

	//Download and Import button click event listeners
	$("#upload-btn").click(function(){
		if( activeElement == "import" ){
			activeElement = "upload";
			$("#videoURL").hide();
			$("#fileUpload").show();
			$("#import-btn").removeClass("active");
			$("#upload-btn").addClass("active");
		}
	});
	$("#import-btn").click(function(){
		if( activeElement == "upload" ){
			activeElement = "import";
			$("#fileUpload").hide();
			$("#videoURL").show();
			$("#upload-btn").removeClass("active");
			$("#import-btn").addClass("active");
		}
	});

	//Simple File Uploader from http://stackoverflow.com/questions/166221/how-can-i-upload-files-asynchronously
	$('#upload-submit').click(function() {
		var file = $("#fileInput").prop('files')[0];
	    if (file.size > 10000000 || (file.type != "audio/mp3" && file.type != "audio/mpeg" && file.type != "audio/wav" && file.type != "audio/ogg")) {
	        alert('Max upload size is 10MB and must be of type mp3, wav, or ogg.');
	    }else{
			$.ajax({
		        // Your server script to process the upload
		        url: 'src/svr/upload.php',
		        type: 'POST',

		        // Form data
		        data: new FormData($('#fileUpload')[0]),

		        // Tell jQuery not to process data or worry about content-type
		        // You *must* include these options!
		        cache: false,
		        contentType: false,
		        processData: false,

		        // Custom XMLHttpRequest
		        xhr: function() {
		            var myXhr = $.ajaxSettings.xhr();
		            if (myXhr.upload) {
		                // For handling the progress of the upload
		                myXhr.upload.addEventListener('progress', function(e) {
		                    if (e.lengthComputable) {
		                        $('progress').attr({
		                            value: e.loaded,
		                            max: e.total,
		                        });
		                    }
		                } , false);
		            }
		            return myXhr;
		        },

				complete: function( xhr, status){
					var response = JSON.parse(xhr.responseText);
					if( response.error == false ){
						if(tracks.trackCount == 1 && tracks.track[0].url == null){
							tracks.track[0].url = response.url;
							tracks.track[0].obj = new Wad({
								source: response.url,
								volume: 1.0,
								detune: 0,
								panning: 0,
								loop: false,
								env: {
									hold: 10000000
								}
							});
							$('#track1-URL').empty();
							$('#track1-URL').append(response.url);
						}else {
							tracks.trackCount += 1;
							tracks.track[ tracks.trackCount - 1 ] = {
								name: "track-" + tracks.trackCount,
								url: response.url,
								trackRef: "track" + tracks.trackCount,
								obj: new Wad({
									source: response.url,
									volume: 1.0,
									panning: 0,
									detune: 0,
									loop: false,
									env: {
										hold: 10000000
									}
								})
							}

							$('.table-track-manager tbody').append('<tr><td><input class="form-control" type="text" name="' + tracks.track[ tracks.trackCount - 1 ].name + '" value="' + tracks.track[tracks.trackCount - 1].name + '"></td><td class="inactive" id="track' + tracks.trackCount + '-URL">' + response.url + '</td></tr>');
							$('.table-track-controller tbody').append('<tr class="' + tracks.track[tracks.trackCount - 1].trackRef + '-controller"><td class="track-name"><span class="fa-stack play" id="'+ tracks.track[tracks.trackCount - 1].trackRef +'-play"><i class="fa fa-circle fa-stack-2x" aria-hidden="true"></i><i class="fa fa-play fa-inverse fa-stack-1x" aria-hidden="true"></i></span> ' + tracks.track[tracks.trackCount - 1].name + '<td class="track-control track-volume"><input type="range" id="' + tracks.track[tracks.trackCount - 1].trackRef + '-volume" max="100" min="0" value="100"></td><td class="track-control track-panning"><input type="range" id="' + tracks.track[tracks.trackCount - 1].trackRef + '-panning" max="100" min="0" value="50"></td><td class="track-control track-detune"><input type="range" id="' + tracks.track[tracks.trackCount - 1].trackRef + '-detune" max="100" min="0" value="50"></td></td></tr>');
						}
						$('#fileInput').val('');
					}
				}
		    });
		}
	});

	//Imports song from URL
	$("#import-submit").click(function(){
		readImportData();
	});

	$('#url').keypress(function(event){
		if(event.which == 13){
			event.preventDefault();
			readImportData();
		}
	});

	//Plays Master Track
	$('#play-btn').click(function(){
		$('#play-btn').addClass('active');
		if($('#pause-btn').hasClass('active')) $('#pause-btn').removeClass('active');
		for(i=0;i<tracks.trackCount; i++){
			if(tracks.track[i].obj != null){
				tracks.track[i].obj.stop();
			}
		}
		if(tracks.stopped == true){
			tracks.mash();
			tracks.master.play();
			tracks.stopped = false;
			tracks.playing = true;
		}else if(tracks.playing != true){
			tracks.master.play();
			tracks.playing = true;
			tracks.stopped = false;
		}
	});

	//Pauses Master Track
	$('#pause-btn').click(function(){
		if($('#play-btn').hasClass('active')) $('#play-btn').removeClass('active');
		if(tracks.stopped == false && tracks.playing == true){
			tracks.master.stop();
			tracks.playing = false;
			$('#pause-btn').addClass('active');
		}
		tracks.master.stop();
	});

	//Stops Master Track
	$('#stop-btn').click(function(){
		if($('#play-btn').hasClass('active')) $('#play-btn').removeClass('active');
		if($('#pause-btn').hasClass('active')) $('#pause-btn').removeClass('active');
		tracks.master.stop();
		tracks.playing = false;
		tracks.stopped = true;
	});

	$('#random-btn').click(function(){
		if(tracks.master != null){
			tracks.master.stop();
			tracks.playing = false;
			tracks.stopped = true;
		}
		for(i=0;i<tracks.trackCount; i++){
			if(tracks.track[i].obj != null){
				tracks.track[i].obj.stop();
			}
		}
		for(i = 0; i < tracks.trackCount; i++){
			$('#' + tracks.track[i].trackRef + '-volume').val(Math.floor(Math.random() * 100));
			$('#' + tracks.track[i].trackRef + '-volume').trigger('change');
			$('#' + tracks.track[i].trackRef + '-panning').val(Math.floor(Math.random() * 100));
			$('#' + tracks.track[i].trackRef + '-panning').trigger('change');
			$('#' + tracks.track[i].trackRef + '-detune').val(Math.floor(Math.random() * 100));
			$('#' + tracks.track[i].trackRef + '-detune').trigger('change');
		}
	});

	$('#download').click(function(){
		for(i=0;i<tracks.trackCount; i++){
			// if(tracks.track[i].obj != null){
			// 	tracks.track[i].obj.stop();
			// }
		}
		if(tracks.master != null){
			if(tracks.stopped == true) {
				tracks.master.stop();
				tracks.playing = false;
				tracks.stopped = true;
			}
			tracks.mash();
			tracks.master.rec.record();
			tracks.master.play();
			console.log(tracks.master);
			setTimeout(function(){
				tracks.master.stop();
				tracks.master.rec.stop();
				tracks.master.rec.createWad();
				tracks.master.rec.exportWAV(function(blob){
					Recorder.forceDownload(blob);
				});
			}, 120000);
		}else{
			tracks.mash();
			tracks.master.rec.record();
			tracks.master.play();
			console.log(tracks.master);
			setTimeout(function(){
				tracks.master.stop();
				tracks.master.rec.stop();
				tracks.master.rec.createWad();
				tracks.master.rec.exportWAV(function(blob){
					Recorder.forceDownload(blob);
				});
			}, 120000);
		}
	});

	//Play button in track manager plays individual tracks.
	$(document).on('click', 'span.play', function(){
		var regexp = /track\d/;
		var trackNum = tracks.getByRef($(this).attr('id').match(regexp)[0]);
		if(tracks.track[trackNum].obj != null){
			if($('#' + tracks.track[trackNum].trackRef + '-play > .fa-play').hasClass('fa-play')){
				$('#' + tracks.track[trackNum].trackRef + '-play > .fa-play').removeClass('fa-play').addClass('fa-pause');
				tracks.track[trackNum].obj.play();
			}else{
				$('#' + tracks.track[trackNum].trackRef + '-play > .fa-pause').removeClass('fa-pause').addClass('fa-play');
				tracks.track[trackNum].obj.stop();
			}
		}
	});

	$(document).on('change', '.track-mger-name', function(){
		var regexp = /track\d/;
		var regexp2 = /track-\d/;
		var trackNum = tracks.getByRef($(this).attr('id').match(regexp));
		var value = $(this).val();
		var newHTML = $('.'+tracks.track[trackNum].trackRef+'-controller > .track-name').html().replace(regexp2, value);
		$('.'+tracks.track[trackNum].trackRef+'-controller > .track-name').empty().append(newHTML);
		tracks.track[trackNum].name = value;
		$()
	})

	//When there is a control changed, change to proper value in the track.
	$('.track-control').on("change", function(){
		var regexp = /track\d/;
		var controlReg = /volume|panning|detune/;
		var trackNum = tracks.getByRef($(this).children().attr('id').match(regexp));
		var value = $('#' + $(this).children().attr('id')).val();
		if( tracks.track[trackNum].obj != null){
			if($(this).children().attr('id').match(controlReg) == "volume"){
				tracks.track[trackNum].obj.setVolume(value/100);
			}else if($(this).children().attr('id').match(controlReg) == "panning"){
				tracks.track[trackNum].obj.setPanning((value-50)/50);
			}else if($(this).children().attr('id').match(controlReg) == "detune"){
				tracks.track[trackNum].obj.setDetune((value-50)*2);
			}
		}
	});
});
