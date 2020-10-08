# BlackboardChecklist

## How to use this

1. Choose a content area where you'd like to use a checklist
2. Create an item in that content area. Give it the name "Checklist Script". Using this name will allow the script to hide that item automatically.
3. Use the HTML mode editor to set the item's content to the following code snippet. Please note that when this tool is out of testing, a different URL will be used.

~~~html
<div id="magicUserID" style="display: none;">@X@user.id@X@</div>
<script src="https://rawcdn.githack.com/mmcr/BlackboardChecklist/7f468e98f41644c6b2bd7db8ceba2ca57300d2eb/bbchecklist.js" type="text/javascript"></script>
~~~

4. Give the name "Learner Guide" to a content item within the content area. Any unordered list items within that content item will be turned into checkboxes. Each list item is tracked by the first twenty text characters.

## Other Notes

Obfuscation with:
https://javascriptobfuscator.com/Javascript-Obfuscator.aspx
https://www.preemptive.com/products/jsdefender/online-javascript-obfuscator-demo