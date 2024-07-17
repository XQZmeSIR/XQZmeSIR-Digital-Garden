>**Written by Amid the Chaos on June 30, 2023.**

>**Contact me(Telegram): @xqzmesir**


Несмотря на отличную работу Readwise’а, принизить трушность и удобство Zotero нельзя(и плохо). Поэтому давайте разбираться как его настроить в связке с Obsidian.

- Но перед этим скажу какой конечный результат будет от проделанных манипуляций:
	- Любые аннотации, как текст так и изображения, будут выгружаться в Obsidian в удобном и заданном для вас формате(используя шаблон).
	- Аннотации и ваши комментарии к ним теперь выносятся в **Callouts**, которые будут **соответствовать цветам выделений в Zotero**. Те, у кого определенный цвет аннотаций означает определенный тип выделения(важно, не понял, проверить, и т.д), особенно оценят это улучшение.
	- Добавился необходимый **CSS сниппет** реализующий вышеописанную функцию
	- Аннотации, независимо где вы их делали, в телефоне или на ПК, будут синхронизироваться и в дальнейшем экспортироваться в Obsidian.
	- Аннотации, которые вы выгрузили а Obsidian, будут содержать работающие ссылки на места выделения в Zotero. Как на телефоне так и на ПК.
	- Пользователи Zotero для iOS смогут начать использовать им как читалкой для всего что PDF или веб-архив.


## 1. Подготовка Zotero

Первым делом нам надо установить плагин Better BibTeX для Zotero.  
Переходим в [данный репозиторий GitHub](https://github.com/retorquere/zotero-better-bibtex/releases/tag/v6.7.174) и скачиваем первый файл с расширением **.xpi**  
Плагин часто обновляется так что смотрите на последий релиз и качайте его. После можно будет самому выставить автоматическое обновление в самом Zotero.

После открываем Zotero и слева наверху жмём на Tools, а затем на Add-ons. Откроется окно Extensions куда вы должды перетащить файл, скачанный по ссылке выше. Перезапускаете и готово. И никаких Mdnotes не понадобится.

## 2. Подготовка Obsidian

В Obsidian скачиваем плагин Zotero Integration и заходим в его опции.  
Далее, на фото укажу нумерацию шагов для вашего удобства.

> ![Фото тут](https://i.imgur.com/ub0brXZ.png)

1.  Скачиваем **PDF Utility**, нажимая на данную нам кнопку.
2.  В разделе **Note Import Location** указываем место куда, собственно, будут выгружаться, сделанные вами в Zotero аннотации. Указываем нужную папку. У меня они храняться в Sources/Zotero. При первом импорте папка Zotero создастся сама.
3.  Включаем Enable Annotation Concatenation, что позволит вам обновлять заметку с аннотациями если вы, к примеру, сделали еще пару выделений в вашей ПДФке и снова импортировали, то тогда существующая заметка перепишется, дополнив новые пометки.
	- **Важно!** Поэтому если вы вынесли выделения в Обсидиан, затем уже в этой заметке что то сами дописали, а затем еще раз сделали пометки в Zotero и заново экспортировали в Обс, то файл перепишется и **ВАШИ добавления(мысли или ссылки)** исчезнут. Keep that in mind.
    - **Решение**: Чтобы такого не было можно поменять название заметки с выгруженными аннотациями и тогда последующая выгрузка создаст просто такой же файл, но обновленный, при этом ваш старый файл не перепишется, а затем вы из старого файла перенесете написанное вами в новый.

## 3. Подготовка Шаблона

Теперь, перед тем как продолжить, разберемся с **шаблоном** по которому будут выгружаться ваши заметки.

Открываем вашу папку-хранилище или, по-другому, ваш Obsidian Vault. Не в самом Obsidian, а вашу локальную папку где лежат все ваши маркдаун файлы. Переходим в папку где вы будете хранить шаблоны для экспорта аннотаций. Я их храню в папке Extra, вы можете где угодно, разницы нет. Создаем маркдаун файл в выбранной вами папке и даем им название вроде ZoteroTemplateBook.md (на ваше усмотрение).

Вот так:

> ![](https://i.imgur.com/GOzt8NV.png)


Открываем файл любым текстовым редактором и вставляем туда содержимое шаблона:

Вставить вот это. (P.S Этот шаблон я использую для книг)
```markdown
> [!info] Metadata
> **Title**:: {{title}}
>
> **Author**:: {{authors}}; {{directors}}
> **Year**:: {{date | format ("YYYY")}}
>
> **Item Type**:: {{itemType | capitalize}}
> **Edition**:: {{edition}}
> **Publisher**: {{publisher}}
> **Pages**:: {{numPages}}
>
> *Read start*::
> *Read end*::
> 
> **Tags**:: `{{hashTags}}` #source/zotero
> **Keywords**:: {{allTags}}
> **URL**:: {{url}}

> [!link]+ Zotero Link
>{{pdfZoteroLink}}

> [!abstract]+
> {{abstractNote}}

### The Book in 3 Sentences


### What can I apply


### Key Takeaways & Evergreens


### Impressions


### How the Book Changed Me


### My Top 3 Quotes


### Highlights
{% for annotation in annotations -%}
>[!Quote|{{annotation.color}}]+
>{%- if annotation.annotatedText -%}*« {{annotation.annotatedText}} »* ([Page {{annotation.page}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.page}}&annotation={{annotation.id}})){% endif %}{% if annotation.imageRelativePath %}![[{{annotation.imageRelativePath}}]][View on page {{annotation.page}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.page}}){% endif %}{% if annotation.comment %}
>
>{{annotation.comment}}{%- endif %}

{% endfor %}

```


Как вы поняли, все то, что **НЕ формулы**(под хедером #, или Read Start-ReadEnd) вы можете менять как угодно. А то что в `{{ }}` скобках лучше не трогать, если только не знаете как с ними работать.

Второе с конца условие `>{{annotation.comment}}{%- endif %}` это то, в каком формате будут отбражаться ВАШИ заметки\комментарии к выделениям в Zotero. Этот символ `>` делает ВАШИ заметки к выделениям цитатой, то бишь blockquote. Если добавить туда второй символ `>` , чтобы получилось вот так: `>>{{annotation.comment}}{%- endif %}` , то ваши комментарии оформятся во вложенный blockquote, что сделает его визуально заметней. Хотя я использую дефолтный вариант из шаблона с одним `>` .

Всталяем, сохраняем, готово.  
Я использую 2 шаблона: для книг(тот что приложил выше) и научных статей. Отличаются они тем, что в шаблоне для research paper, к примеру, более богатая метадата, чем в книгах.

Ниже приложу содержимое шаблона для research papers для тех кому он нужен. Так же создаем для них маркдаун файлы и вставляем туда это содержимое.

**Для research articles:**
```markdown
> [!info]+ Metadata
> **Title**:: {{title}}
> 
> **Author**:: {{authors}}; {{directors}}
> **Year**:: {{date | format ("YYYY")}}
> **Item Type**:: {{itemType}}
>
> **Citekey**:: {{citationKey}}
> **Tags**:: `{{hashTags}}` #source/zotero
> **Keywords**:: {{allTags}}
> **Related**:: {{related}}
>
> **Journal**:: {{publicationTitle}}
> **Issue**:: {{issue}}
> **Volume**:: {{volume}}
>
> *Read start*::
> *Read end*::
> 
> **URL**:: {{url}}
> **DOI**:: {{DOI}}

> [!link]+ Zotero Link
> {{pdfZoteroLink}}

> [!abstract]+
> {{abstractNote}}


## Key Takeaways & Evergreens


### Highlights
{% for annotation in annotations -%}
>[!Quote|{{annotation.color}}]+
>{%- if annotation.annotatedText -%}*« {{annotation.annotatedText}} »* ([Page {{annotation.page}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.page}}&annotation={{annotation.id}})){% endif %}{% if annotation.imageRelativePath %}![[{{annotation.imageRelativePath}}]][View on page {{annotation.page}}](zotero://open-pdf/library/items/{{annotation.attachment.itemKey}}?page={{annotation.page}}){% endif %}{% if annotation.comment %}
>
>{{annotation.comment}}{%- endif %}

{% endfor %}

```


После того как создали 1 или все 2 шаблона можете переходить к следующему шагу.

## 4. Создаем CSS сниппет для разноцветных Callouts в цвет выделений

Открываем папку нашего хранилища Obsidian и в папке .obsidian/snippets/ создаем файл с расширением .css куда вставляем следующее:

**CSS:**
```css
/* Red */
.callout[data-callout-metadata="#ff6666"] {
    --callout-color: 205, 52, 92;
}

/* Green */
.callout[data-callout-metadata="#5fb236"] {
    --callout-color: 114, 162, 100;
}

/* Blue */
.callout[data-callout-metadata="#2ea8e5"] {
    --callout-color: 52, 82, 255;
}

/* Purple */
.callout[data-callout-metadata="#a28ae5"] {
    --callout-color: 157, 131, 242;
}

/* Orange */
.callout[data-callout-metadata="#f19837"] {
    --callout-color: 244, 164, 96;
}

/* Yellow */
.callout[data-callout-metadata="#ffd400"] {
    --callout-color: 255, 236, 0;
}

/* Magenta */
.callout[data-callout-metadata="#e56eee"] {
    --callout-color: 255, 33, 255;
}

/* Gray */
.callout[data-callout-metadata="#aaaaaa"] {
    --callout-color: 152, 152, 152;
}

.callout-icon {
    display: flex;
}

```

Сохраняем файл, закрываем. Открываем Obsidian и включаем сниппет в настройках в разделе Appearance. Готово

## 5. Настраиваем Import Formats в плагине Zotero Integration

Теперь когда шаблон готов заходим опять в Obsidian в опции плагина Zotero Integration и в разделе **Import Formats** делаем следующее:

Приложил фото с шагами:

>![](https://i.imgur.com/pZIUv74.png)
1.  Add Import Format
2.  Даем название для этого формата. Тут мы, грубо говоря, говорим Obsidian’у что мы будем выгружать: книгу или статью. Если вы создали все 2 шаблона, которые я приложил сверху, то, соответственно, создадим сейчас 2 формата.
3. Указываем путь где в папке Obsidian будет создаваться заметка с аннотациями. **{{title}}** значит какое имя будет у вашей заметки согласно Title’у файла в Zotero. Можно выбрать {{citekey}}, индивидуально.
4.  Путь где будут сохраняться фото-выделения. Допустим вы выделили в Zotero область. Эта область(фотка) при импорте в Обс будет сохранена в указанную папку. Если для фото вы используете папку Assets или Attachments, то этот путь и пишете. У меня они хранятся в, дополнительно созданной папке, ZoteroAttach, чтобы разграничить их с остальными.
5.  **Самое важное**, выбираем путь к вашему маркдаун файлу-шаблону, который мы ранее создали и поместили в определенную папку.
6. Ну и добавляем стиль для библиографии. Выберите как на фото Chicago Manual

Готово. Вы создали Import Format. Делаете также для двух других шаблонов меняя только название Import Format’а и путь к шаблону с нужным типом.

## 6. Создаем Parent Item для наших PDF в Zotero

Чтобы выгружать аннотации для каждой PDF нужно создать Parent Item. Для научных статей, Parent Item часто создается сам, когда мы добавляем статью в Zotero. Если же мы закинули в Zotero какую-нибудь книгу, метадата которой не была автоматически прочитана Zotero, то она добавляется “голой”.

**Вот так:**

>![](https://i.imgur.com/ZUEyrJp.jpeg)

Поэтому каждую “голую” PDF кликайте правой кнопкой мыши и жмёте Create Parent Item. Если это книга, то прописываете ISBN книги с сайта Амазон, к примеру. Если же метадата не так важна, то просто жмете **Manual Enter** и Parent Item создастся пустой и ее уже можно будет выгружать в Obsidian.

**Вот так:**

>![](https://i.imgur.com/VQowwny.jpg)


# Готово

Теперь заходим в Zotero(и держим его открытым или свёрнутым), затем в Обсидиан и пробуем запустить Pop-up окно Zotero через палитру команд в Obsidian.

1.  Ctrl + P(дефолт), затем вводим Zotero и появляются созданные нами ранее Import Formats для того или иного типа заметок.

**Фото:**

> ![](https://i.imgur.com/Nz2unFH.jpg)

2.  Всплывает окошко Zotero куда вы вбиваете название статьи/книги, предварительно аннотированную. Если у ПДФ нет Parent Item, то она не покажется, нужно ее создать как ранее уже объяснил.

**Фото:**

> ![](https://i.imgur.com/ZMLLIVQ.jpg)

3.  Выбираем нужную статью, он впишеться в окошко и подтверждаем нажав Enter.
4.  Готово, через секунду-две откроется заметка с аннотациями, а сам файл будет в вашей папке(что мы указали).

**Конечным результатом будет мгновенно созданная заметка с метадатой и вашими хайлайтами. И выглядеть это будет вот так:**

> ![](https://i.imgur.com/ECMve9Z.jpg)


### Что касается Zotero на IOS устройствах

При аннотации PDF в Айфоновском Zotero, они синхронизируются с ПК. Откывая заметку с выделениями в мобильном Obsidian, все ссылки на метса выделений кликабельные и перебрасывают тебя к месту выделения в Zotero КАК на телефоне ТАК и на ПК.


> Пользуйтесь :)
