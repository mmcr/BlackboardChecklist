# BlackboardChecklist

## How to use this

1. Choose a content area where you'd like to use a checklist
2. Create an item in that content area. Give it the name "Checklist Script". Using this name will allow the script to hide that item automatically.
3. Use the HTML mode editor to set the item's content to the following code snippet. Please note that when this tool is out of testing, a different URL will be used.

~~~html
<div id="magicUserID" style="display: none;">@X@user.id@X@</div>
<script src="https://rawcdn.githack.com/mmcr/BlackboardChecklist/b910a6699e299b995f710bf6913a719f895ed758/bbchecklist.js" type="text/javascript"></script>
~~~

4. Name a content item with the area "Learner Guide." Any unordered list items within that content item will be turned into checkboxes.