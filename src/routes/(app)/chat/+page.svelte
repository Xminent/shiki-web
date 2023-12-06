<script lang="ts">
	import { PUBLIC_RTC_URL } from '$env/static/public';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { onMount } from 'svelte';

	let pc: RTCPeerConnection | null;
	let dc: RTCDataChannel | null;
	let output = '';
	let message = '';
	let inputDisabled = true;
	let sendDisabled = true;
	let count = 0;
	let MAX_TRIES = 7;
	let queue: Uint8Array[] = [];

	onMount(() => {
		pc = new RTCPeerConnection({
			iceServers: [
				{
					urls: 'stun:stun.l.google.com:19302'
				}
			]
		});

		pc.oniceconnectionstatechange = () => {
			console.log('Connection state changed: ', pc?.iceConnectionState);
		};

		pc.onicecandidate = (e) => {
			if (e.candidate) {
				return console.log('Received ice candidate: ', e.candidate);
			}

			console.log('All local candidates received');
		};

		dc = pc.createDataChannel('webudp');

		dc.onopen = () => {
			console.log('Data channel connected');

			inputDisabled = false;
			sendDisabled = false;
		};

		dc.onmessage = (e) => {
			console.log('Message received: ', e.data);

			output += `${e.data}\n`;
		};

		dc.onerror = (e) => {
			console.log('Data channel error:', e);
		};

		pc.createOffer().then((e) => pc?.setLocalDescription(e));

		return () => {
			pc?.close();
			dc?.close();

			pc = null;
			dc = null;
		};
	});

	async function sendOffer() {
		const sdp = pc?.localDescription?.sdp;

		if (!pc || !sdp) {
			return;
		}

		try {
			const response = await fetch(PUBLIC_RTC_URL, {
				method: 'POST',
				body: sdp
			});

			if (!response.ok) {
				throw new Error(`Request failed: ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			console.log('Response received: ', data);

			const { answer, candidate } = data;

			await pc.setRemoteDescription(new RTCSessionDescription(answer));
			await pc.addIceCandidate(new RTCIceCandidate(candidate));

			console.log('Add ice candidate success');
		} catch (error) {
			console.log('Error: ', error);
		}
	}

	async function getMicrophonePermission() {
		// @ts-ignore
		if (!Recorder.isRecordingSupported()) {
			return alert('Recording is not supported in your browser');
		}

		try {
			const options = {
				numberOfChannels: 2,
				encoderSampleRate: 48000,
				encoderPath: './dist/encoderWorker.min.js',
				streamPages: true,
				maxFramesPerPage: 1
			};

			// @ts-ignore
			const recorder = new Recorder(options);
			const decoder = new Worker('/dist/decoderWorker.min.js');

			decoder.postMessage({
				command: 'init',
				decoderSampleRate: 48000,
				outputBufferSampleRate: 48000
			});

			decoder.onmessage = (e) => {
				// null means decoder is finished
				if (e.data === null) {
					return console.log('Decoder finished');
				}

				// e.data contains decoded buffers as float32 values
				console.log('Decoder received: ', e.data);
			};

			recorder.onstart = () => {
				console.log('Recorder is started');
			};

			recorder.onstop = () => {
				console.log('Recorder is stopped');
			};

			recorder.onpause = () => {
				console.log('Recorder is paused');
			};

			recorder.onresume = () => {
				console.log('Recorder is resuming');
			};

			recorder.ondataavailable = async (data: Uint8Array) => {
				if (count == MAX_TRIES) {
					return;
				}

				const dataCopy = new Uint8Array(data);

				decoder.postMessage(
					{
						command: 'decode',
						pages: dataCopy
					},
					[dataCopy.buffer]
				);

				count++;

				if (dc?.readyState !== 'open') {
					return queue.push(data);
				}

				if (queue.length > 0) {
					for (const data of queue) {
						dc?.send(data);
					}

					queue = [];
				}

				dc?.send(data);
			};

			console.log({ recorder });

			recorder.start().catch((e: { message: any }) => {
				console.log('Error encountered:', e.message);
			});
		} catch (error) {
			console.error(error);
		}
	}

	async function onConnect() {
		await sendOffer();
		await getMicrophonePermission();
	}

	function onSend() {
		if (!message) {
			return;
		}

		dc?.send(message);
		message = '';
	}
</script>

<svelte:head>
	<script src="/dist/recorder.min.js"></script>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="w-full max-w-md space-y-4">
		<div class="flex justify-center">
			<Textarea
				class="w-full px-4 py-2 text-sm rounded-md focus:outline-none focus:ring focus:ring-gray-300"
				readonly
				bind:value={output}
				placeholder="Server response"
			/>
		</div>
		<div class="flex justify-center">
			<Button
				class="w-full px-4 py-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
				disabled={!inputDisabled}
				on:click={onConnect}
			>
				Connect
			</Button>
		</div>
		<div class="flex justify-center">
			<Input
				class="w-full px-4 py-2 text-sm bg-gray-200 rounded-md focus:outline-none focus:ring focus:ring-gray-300"
				disabled={inputDisabled}
				placeholder="Send Message"
				bind:value={message}
			/>
		</div>
		<div class="flex justify-center">
			<Button
				class="w-full px-4 py-2 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
				disabled={sendDisabled}
				on:click={onSend}
			>
				Submit
			</Button>
		</div>
	</div>
</div>
