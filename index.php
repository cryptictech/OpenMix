<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<!--Items that will need to be edited to match branding-->
		<title>Sound Application</title>
		<meta name="description" content="">
		<meta name="author" content="">
		<meta name="keywords" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--Styles-->

		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
		<link rel="stylesheet" href="res/styles/main.css">
	</head>
	<body>
		<!--Main navigational navbar-->
		<nav class="navbar navbar-default">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-nav" aria-expanded="false">
				        <span class="sr-only">Toggle navigation</span>
				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span>
			      	</button>
					<a href="#" class="navbar-brand"><img src="res/img/logo.jpg" class="logo" alt="Blondbird Logo"></a><a href="#" class="navbar-brand">Blondbird Sound App</a>
				</div>
				<div class="collapse navbar-collapse" id="main-nav">
					<ul class="nav navbar-nav">
						<li><a href="#">Our Company</a></li>
					</ul>
				</div>
			</div>
		</nav>

		<!--Body-->
		<div class="container">
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-10">
					<div class="selector">
						<button class="btn btn-info" type="button" id="import-btn" name="import">Import</button>
						<button class="btn btn-info" type="button" id="upload-btn" name="upload">Upload</button>
					</div>
				</div>
				<div class="col-md-1"></div>
			</div>
			<div class="row">
				<div class="col-md-1"></div>
				<div class="col-md-10">
					<p class="ex-padding-top">Currently only audio is supported. Audio file formats that are supported are .mp3, .ogg, and .wav.</p>
					<form id="videoURL" class="fileForm dontSub">
						<div class="row">
							<div class="col-lg-12">
								<div class="form-group">
									<label for="url">Paste URL for video or audio file</label>
									<input type="text" class="form-control" id="url" name="url" placeholder="Paste URL here" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" autofocus required>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 cluster-items">
								<div class="form-group">
									<div class="row">
										<div class="col-xs-4"></div>
										<div class="col-xs-1">
											<input type="radio" class="form-control sm-radio" id="video" name="file_type" value="video" disabled>
										</div>
										<div class="col-sm-3">
											<label for="video" class="text-center">Video</label>
										</div>
										<div class="col-xs-4"></div>
									</div>

								</div>
							</div>
							<div class="col-md-6 cluster-items">
								<div class="form-group">
									<div class="row">
										<div class="col-xs-4"></div>
										<div class="col-xs-1">
											<input type="radio" class="form-control sm-radio" id="audio" name="file_type" value="audio" checked>
										</div>
										<div class="col-xs-3">
											<label for="audio" class="text-center">Audio</label>
										</div>
										<div class="col-xs-4"></div>
									</div>
								</div>
							</div>
						</div>
						<button class="btn btn-success btn-submit" type="button" id="import-submit" name="button">Import</button>
					</form>
					<form id="fileUpload" class="fileForm" action="#" method="post" enctype="multipart/form-data">
						<div class="form-group">
							<label for="fileInput">Choose your audio or video file</label>
							<input type="file" id="fileInput" name="file" value="">

						</div>
						<button class="btn btn-success btn-submit" type="button" id="upload-submit" name="button">Upload</button>
					</form>
				</div>
				<div class="col-md-1"></div>
			</div>

			<table class="table table-striped table-track-manager">
				<thead>
					<tr>
						<th>Track ID</th>
						<th>Track URL</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><input class="form-control track-mger-name" type="text" name="track-1" id="track1-name" value="track-1"></td>
						<td class="inactive" id="track1-URL">Nothing Yet - Import or upload file</td>
					</tr>
				</tbody>
			</table>
			<table class="table table-striped table-track-controller">
				<thead>
					<tr>
						<th>Track ID</th>
						<th>Track Volume</th>
						<th>Track Panning</th>
						<th>Track Detune</th>
					</tr>
				</thead>
				<tbody>
					<tr class="track1-controller">
						<td class="track-name"><span class="fa-stack play" id="track1-play"><i class="fa fa-circle fa-stack-2x" aria-hidden="true"></i><i class="fa fa-play fa-inverse fa-stack-1x" aria-hidden="true"></i></span> track-1</td>
						<td class="track-control track-volume"><input type="range" id="track1-volume" max="100" min="0" value="100"></td>
						<td class="track-control track-panning"><input type="range" id="track1-panning" max="100" min="0" value="50"></td>
						<td class="track-control track-detune"><input type="range" id="track1-detune" max="100" min="0" value="50"></td>
					</tr>
				</tbody>
			</table>
			<div class="audio-player centered">
				<i class="fa fa-play fa-3x" id="play-btn" aria-hidden="true"></i><i class="fa fa-pause fa-3x" id="pause-btn" aria-hidden="true"></i><i class="fa fa-stop fa-3x" id="stop-btn" aria-hidden="true"></i><i class="fa fa-random fa-3x" id="random-btn" aria-hidden="true"></i>
			</div>
			<div class="wrapper centered" id="download-wrapper">
				<button class="btn btn-success btn-lg centered" id="download">Download</button>
			</div>

		</div>

		<!--Footer navbar-->
		<div class="navbar navbar-default navbar-fixed-bottom">
			<div class="container">
				<p>Copyright 2017 &copy; Blondbird</p>
			</div>
		</div>

		<!--Scripts-->
		<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
		<script type="text/javascript" src="src/cli/wad.min.js"></script>
		<script type="text/javascript" src="src/cli/app.js"></script>
	</body>
</html>
