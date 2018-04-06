export default `
<div id="embed-container"></div>
<script src="https://player.hulu.com/iframe/iframe_api"></script>
<script>
  window.RNPostMessage = (data) => window.webkit.messageHandlers.reactNative.postMessage(data);
  document.addEventListener('message', (event) => {
    RNPostMessage('event: ' + JSON.stringify(event));
  });

  if (window.HuluPlayer && window.HuluPlayer.DP) {
    RNPostMessage('loaded');
  }
  var element = document.getElementById('hulu-playerapi-script');
  element.onload = () => RNPostMessage('loaded');
</script>
`;
