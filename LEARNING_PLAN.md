# SAPUI5 Learning Plan

**Адаптовано для розробників з React бекграундом та ADHD**

---

## Про цей план

Цей план містить 15 практичних завдань для освоєння SAPUI5, організованих за рівнями складності. Кожне завдання:
- ⏱️ Займає 30-60 хвилин
- 🎯 Має чіткий візуальний результат
- 🔄 Містить паралелі з React для легшого розуміння
- ✅ Можна виконувати в будь-якому порядку (але краще послідовно)

**Базовий проєкт:** Todo додаток з функціями додавання, фільтрації, пошуку та видалення завершених завдань.

---

## 📊 Прогрес

**Рівень 1 (Основи):** ☐☐☐  
**Рівень 2 (Дані):** ☐☐☐  
**Рівень 3 (UX):** ☐☐☐  
**Рівень 4 (Просунуті фічі):** ☐☐☐  
**Рівень 5 (Архітектура):** ☐☐☐

---

## РІВЕНЬ 1: Знайомство з основами ⚡

### Базові концепції

**Паралелі з React:**
- **View (XML)** = JSX розмітка
- **Controller** = логіка компонента (хуки + методи)
- **Model** = state + props
- **manifest.json** = конфігурація додатку

---

### ☐ Завдання 1.1: Додай лічильник активних завдань

**⏱️ Час:** 30 хвилин  
**🎯 Мета:** Зрозуміти data binding (як useState в React)

#### Що робити:

1. Відкрий `webapp/view/App.view.xml`
2. Знайди секцію `<f:DynamicPageHeader>`
3. Додай Text елемент під інпутом для відображення лічильника:
   ```xml
   <Text text="Залишилось: {/itemsLeftCount} завдань" class="sapUiSmallMarginTop"/>
   ```
4. Запусти додаток: `npm start`
5. Перевір, що лічильник оновлюється при відмічанні завдань

#### 🎯 Очікуваний результат:
Побачиш динамічний текст, який показує кількість незавершених завдань. При зміні статусу завдань лічильник автоматично оновлюється.

#### 🔄 Паралель з React:
```javascript
// React
const [count, setCount] = useState(0);
<div>{count} items left</div>

// SAPUI5 - не треба useState! Binding робить це автоматично
<Text text="{/itemsLeftCount} items left" />
```

#### 💡 Що ти дізнаєшся:
- Як працює one-way data binding
- Як прив'язувати дані з моделі до UI
- Синтаксис `{/path}` для доступу до моделі

---

### ☐ Завдання 1.2: Зміни колір для завершених завдань

**⏱️ Час:** 30 хвилин  
**🎯 Мета:** Познайомитись зі стилями та CSS селекторами

#### Що робити:

1. Відкрий `webapp/css/styles.css`
2. Подивись на існуючі стилі з селектором `li[data-todo-item-completed="true"]`
3. Додай нові стилі, наприклад:
   ```css
   li[data-todo-item-completed="true"] .sapMText {
       color: #999;
       font-style: italic;
       opacity: 0.7;
   }
   ```
4. Оновіть сторінку в браузері
5. Відміть завдання як завершене та подивись на зміни

#### 🎯 Очікуваний результат:
Завершені завдання виглядають по-іншому (сірий колір, курсив, напівпрозорі).

#### 🔄 Паралель з React:
```javascript
// React
<div className={completed ? 'completed-task' : ''}>

// SAPUI5 - використовуємо customData + CSS
<customData>
  <core:CustomData key="todo-item-completed" 
                   value="{= String(${completed})}" 
                   writeToDom="true" />
</customData>
```

#### 💡 Що ти дізнаєшся:
- Як працює customData для динамічних атрибутів
- CSS селектори по data-атрибутах
- Чому в SAPUI5 не можна просто додавати динамічні класи

---

### ☐ Завдання 1.3: Додай кнопку "Видалити" для кожного завдання

**⏱️ Час:** 45 хвилин  
**🎯 Мета:** Навчитись працювати з event handlers та binding context

#### Що робити:

1. Відкрий `webapp/view/App.view.xml`
2. Знайди `<CustomListItem>` де відображаються завдання
3. Додай кнопку видалення в HBox:
   ```xml
   <HBox width="100%" alignItems="Center">
       <CheckBox selected="{completed}" text="{title}"/>
       <ToolbarSpacer />
       <Button icon="sap-icon://delete" 
               type="Transparent" 
               press=".onDeleteItem"/>
   </HBox>
   ```
4. Відкрий `webapp/controller/App.controller.js`
5. Додай метод видалення:
   ```javascript
   onDeleteItem(oEvent) {
       const oListItem = oEvent.getSource().getParent();
       const oTodo = oListItem.getBindingContext().getObject();
       
       const oModel = this.getModel();
       const aTodos = oModel.getProperty("/todos");
       const aNewTodos = aTodos.filter(todo => todo.title !== oTodo.title);
       
       oModel.setProperty("/todos", aNewTodos);
   }
   ```

#### 🎯 Очікуваний результат:
Біля кожного завдання з'являється іконка кошика. При кліку завдання видаляється зі списку.

#### 🔄 Паралель з React:
```javascript
// React
<button onClick={() => onDelete(item.id)}>Delete</button>

// SAPUI5 - дані "прикріплені" до DOM через binding
<Button press=".onDeleteItem" />
// В handler отримуємо дані через getBindingContext()
```

#### 💡 Що ти дізнаєшся:
- Event handlers в SAPUI5 (синтаксис `.methodName`)
- Binding context - як отримати дані елемента
- getSource() та getParent() для навігації по DOM
- Як оновлювати модель (setProperty)

---

## РІВЕНЬ 2: Робота з даними 🔄

### ☐ Завдання 2.1: Додай можливість редагувати завдання

**⏱️ Час:** 60 хвилин  
**🎯 Мета:** Зрозуміти two-way binding та умовне відображення

#### Що робити:

1. Додай поле `isEditing: false` до кожного todo в `webapp/model/todoitems.json`
2. У `webapp/view/App.view.xml` змінити `CustomListItem`:
   ```xml
   <HBox width="100%" alignItems="Center">
       <CheckBox selected="{completed}" visible="{= !${isEditing} }"/>
       
       <Text text="{title}" 
             visible="{= !${isEditing} }"
             class="sapUiTinyMarginBegin">
           <layoutData>
               <FlexItemData growFactor="1" />
           </layoutData>
       </Text>
       
       <Input value="{title}" 
              visible="{= ${isEditing} }"
              width="100%">
           <layoutData>
               <FlexItemData growFactor="1" />
           </layoutData>
       </Input>
       
       <Button icon="{= ${isEditing} ? 'sap-icon://save' : 'sap-icon://edit' }" 
               type="Transparent" 
               press=".onToggleEdit"/>
       <Button icon="sap-icon://delete" 
               type="Transparent" 
               press=".onDeleteItem"/>
   </HBox>
   ```
3. Додай метод в контролері:
   ```javascript
   onToggleEdit(oEvent) {
       const oListItem = oEvent.getSource().getParent();
       const sPath = oListItem.getBindingContext().getPath();
       const oModel = this.getModel();
       const bIsEditing = oModel.getProperty(sPath + "/isEditing");
       
       oModel.setProperty(sPath + "/isEditing", !bIsEditing);
   }
   ```

#### 🎯 Очікуваний результат:
При кліку на іконку олівця текст замінюється на інпут, можна редагувати. При кліку на іконку збереження повертається режим перегляду.

#### 🔄 Паралель з React:
```javascript
// React - треба вручну керувати станом
const [isEditing, setIsEditing] = useState(false);
const [value, setValue] = useState(title);
onChange={(e) => setValue(e.target.value)}

// SAPUI5 - two-way binding робить все автоматично
<Input value="{title}" />
// Модель оновлюється автоматично при введенні!
```

#### 💡 Що ти дізнаєшся:
- Two-way binding для інпутів
- Expression binding `{= ${condition} ? 'a' : 'b' }`
- Як контролювати видимість елементів
- getPath() для роботи зі specific елементами

---

### ☐ Завдання 2.2: Додай дату створення завдання

**⏱️ Час:** 45 хвилин  
**🎯 Мета:** Робота з датами та форматерами

#### Що робити:

1. Оновити метод `addTodo` в контролері:
   ```javascript
   addTodo() {
       const oModel = this.getModel();
       const aTodos = [...this.getTodos()];
       
       aTodos.push({
           id: Date.now(),
           title: oModel.getProperty("/newTodo"),
           completed: false,
           isEditing: false,
           createdAt: new Date().toISOString()
       });
       
       oModel.setProperty("/todos", aTodos);
       oModel.setProperty("/newTodo", "");
   }
   ```

2. Додати formatter в контролері:
   ```javascript
   formatDate(sDateString) {
       if (!sDateString) return "";
       const oDate = new Date(sDateString);
       const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
           pattern: "dd MMM yyyy, HH:mm"
       });
       return oDateFormat.format(oDate);
   }
   ```

3. Відобразити дату у View:
   ```xml
   <VBox>
       <Text text="{title}"/>
       <Text text="{path: 'createdAt', formatter: '.formatDate'}" 
             class="sapUiTinyText"/>
   </VBox>
   ```

#### 🎯 Очікуваний результат:
Під кожним завданням відображається дата та час створення в читабельному форматі.

#### 🔄 Паралель з React:
```javascript
// React
{new Date(createdAt).toLocaleDateString()}

// SAPUI5 - використовуємо formatter
formatter: '.formatDate'
```

#### 💡 Що ти дізнаєшся:
- Formatters для перетворення даних перед відображенням
- Робота з DateFormat API
- Як передавати formatter через binding
- ID генерація з Date.now()

---

### ☐ Завдання 2.3: Додай пріоритети (Low, Medium, High)

**⏱️ Час:** 60 хвилин  
**🎯 Мета:** Робота з dropdown та enum значеннями

#### Що робити:

1. Створити модель для пріоритетів у `manifest.json` або в `onInit`:
   ```javascript
   this.getView().setModel(new JSONModel({
       priorities: [
           { key: "low", text: "Low", color: "#5E696E" },
           { key: "medium", text: "Medium", color: "#E9730C" },
           { key: "high", text: "High", color: "#BB0000" }
       ]
   }), "priorities");
   ```

2. Додати Select для вибору пріоритету при створенні в View:
   ```xml
   <HBox>
       <Input id="addTodoItemInput" 
              value="{/newTodo}" 
              placeholder="{i18n>INPUT_PLACEHOLDER}">
           <layoutData>
               <FlexItemData growFactor="1" />
           </layoutData>
       </Input>
       <Select id="prioritySelect" 
               selectedKey="{/newTodoPriority}"
               items="{priorities>/priorities}">
           <core:Item key="{priorities>key}" text="{priorities>text}"/>
       </Select>
       <Button text="Add" press=".addTodo"/>
   </HBox>
   ```

3. Оновити `addTodo` щоб зберігати пріоритет
4. Додати кольоровий індикатор в список:
   ```xml
   <core:Icon src="sap-icon://flag" 
              color="{path: 'priority', formatter: '.formatPriorityColor'}"
              class="sapUiTinyMarginEnd"/>
   ```

5. Створити formatter для кольору:
   ```javascript
   formatPriorityColor(sPriority) {
       const oPriorities = this.getView().getModel("priorities").getProperty("/priorities");
       const oPriority = oPriorities.find(p => p.key === sPriority);
       return oPriority ? oPriority.color : "#5E696E";
   }
   ```

#### 🎯 Очікуваний результат:
Можна вибрати пріоритет при створенні завдання. Біля кожного завдання відображається кольоровий прапорець відповідно до пріоритету.

#### 💡 Що ти дізнаєшся:
- Select control та aggregation binding
- Named models (пріоритети в окремій моделі)
- Динамічні кольори через formatter
- Робота з enum-подібними структурами

---

## РІВЕНЬ 3: Покращення UX 🎨

### ☐ Завдання 3.1: Додай валідацію для порожнього інпута

**⏱️ Час:** 30 хвилин  
**🎯 Мета:** Client-side валідація та feedback користувачу

#### Що робити:

1. Оновити метод `addTodo`:
   ```javascript
   addTodo() {
       const oModel = this.getModel();
       const sNewTodo = oModel.getProperty("/newTodo");
       
       if (!sNewTodo || sNewTodo.trim() === "") {
           const oInput = this.byId("addTodoItemInput");
           oInput.setValueState("Error");
           oInput.setValueStateText("Please enter a task");
           
           sap.m.MessageToast.show("Task cannot be empty");
           return;
       }
       
       const oInput = this.byId("addTodoItemInput");
       oInput.setValueState("None");
       
       const aTodos = [...this.getTodos()];
       aTodos.push({
           id: Date.now(),
           title: sNewTodo.trim(),
           completed: false,
           isEditing: false,
           createdAt: new Date().toISOString(),
           priority: oModel.getProperty("/newTodoPriority") || "low"
       });
       
       oModel.setProperty("/todos", aTodos);
       oModel.setProperty("/newTodo", "");
   }
   ```

2. Додати liveChange для очищення помилки:
   ```xml
   <Input id="addTodoItemInput" 
          value="{/newTodo}"
          liveChange=".onInputChange"
          valueState="{/inputState}"
          placeholder="{i18n>INPUT_PLACEHOLDER}"/>
   ```

3. Додати handler:
   ```javascript
   onInputChange(oEvent) {
       const oInput = oEvent.getSource();
       if (oInput.getValue()) {
           oInput.setValueState("None");
       }
   }
   ```

#### 🎯 Очікуваний результат:
Не можна додати порожнє завдання. З'являється MessageToast та червона рамка навколо інпута з текстом помилки.

#### 🔄 Паралель з React:
```javascript
// React
const [error, setError] = useState("");
if (!value) setError("Cannot be empty");

// SAPUI5 - використовуємо ValueState
oInput.setValueState("Error");
oInput.setValueStateText("Message");
```

#### 💡 Що ти дізнаєшся:
- ValueState для візуалізації помилок
- MessageToast для notifications
- byId() для отримання контролів
- liveChange vs change events

---

### ☐ Завдання 3.2: Додай сортування (за датою, за алфавітом)

**⏱️ Час:** 45 хвилин  
**🎯 Мета:** Робота з Sorter API

#### Що робити:

1. ДодатиSelect для сортування в headerToolbar:
   ```xml
   <Select selectedKey="{/sortKey}" 
           change=".onSort"
           width="10rem">
       <items>
           <core:Item key="date" text="By Date"/>
           <core:Item key="title" text="By Title"/>
           <core:Item key="priority" text="By Priority"/>
       </items>
   </Select>
   ```

2. Додати метод сортування:
   ```javascript
   onSort(oEvent) {
       const sKey = oEvent.getParameter("selectedItem").getKey();
       const oList = this.byId("todoList");
       const oBinding = oList.getBinding("items");
       
       let oSorter;
       switch(sKey) {
           case "date":
               oSorter = new sap.ui.model.Sorter("createdAt", true);
               break;
           case "title":
               oSorter = new sap.ui.model.Sorter("title", false);
               break;
           case "priority":
               const mPriorityOrder = { high: 0, medium: 1, low: 2 };
               oSorter = new sap.ui.model.Sorter("priority", false, false, 
                   (a, b) => mPriorityOrder[a] - mPriorityOrder[b]
               );
               break;
       }
       
       oBinding.sort(oSorter);
   }
   ```

#### 🎯 Очікуваний результат:
Можна сортувати завдання за різними критеріями. Список автоматично перебудовується.

#### 💡 Що ти дізнаєшся:
- Sorter API для сортування
- getBinding() для роботи з list binding
- Custom comparator функції
- Sorting не змінює модель, тільки відображення

---

### ☐ Завдання 3.3: Додай категорії (Work, Personal, Shopping)

**⏱️ Час:** 60 хвилин  
**🎯 Мета:** Групування та багаторівнева фільтрація

#### Що робити:

1. Створити модель категорій (як з пріоритетами)
2. Додати Select категорій при створенні
3. Додати SegmentedButton для фільтрації по категоріях (в новий toolbar)
4. Оновити метод `onFilter` щоб враховувати і статус, і категорію
5. Додати іконку категорії біля завдання

#### 🎯 Очікуваний результат:
Можна призначати категорії завданням та фільтрувати по них. Іконка категорії відображається біля завдання.

#### 💡 Що ти дізнаєшся:
- Множинна фільтрація (AND/OR умови)
- Комбінування фільтрів
- Іконки для категорій
- Складніша бізнес-логіка

---

## РІВЕНЬ 4: Просунуті фічі 🚀

### ☐ Завдання 4.1: Додай LocalStorage для збереження

**⏱️ Час:** 45 хвилин  
**🎯 Мета:** Персистентність даних

#### Що робити:

1. Створити helper для роботи з LocalStorage в `webapp/util/StorageHelper.js`:
   ```javascript
   sap.ui.define([], () => {
       return {
           save(sKey, oData) {
               localStorage.setItem(sKey, JSON.stringify(oData));
           },
           
           load(sKey) {
               const sData = localStorage.getItem(sKey);
               return sData ? JSON.parse(sData) : null;
           }
       };
   });
   ```

2. В `onInit` контролера завантажувати дані:
   ```javascript
   onInit() {
       // ... існуючий код ...
       
       const oStoredData = StorageHelper.load("todoData");
       if (oStoredData) {
           this.getModel().setData(oStoredData);
       }
   }
   ```

3. Зберігати при кожній зміні (можна через helper метод):
   ```javascript
   _saveToStorage() {
       StorageHelper.save("todoData", this.getModel().getData());
   }
   ```

4. Викликати `_saveToStorage()` в `addTodo`, `onDeleteItem`, тощо

#### 🎯 Очікуваний результат:
Дані зберігаються після перезавантаження сторінки.

#### 🔄 Паралель з React:
```javascript
// React
useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
}, [todos]);

// SAPUI5 - викликаємо після кожної зміни моделі
this._saveToStorage();
```

#### 💡 Що ти дізнаєшся:
- LocalStorage API
- Серіалізація/десеріалізація JSON
- Створення helper модулів
- Lifecycle методи (onInit)

---

### ☐ Завдання 4.2: Додай статистику (Dialog з інформацією)

**⏱️ Час:** 60 хвилин  
**🎯 Мета:** Робота з Dialog та обчислювані властивості

#### Що робити:

1. Створити Fragment `webapp/view/StatisticsDialog.fragment.xml`:
   ```xml
   <core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
       <Dialog title="Statistics" 
               contentWidth="400px"
               afterClose=".onDialogClose">
           <VBox class="sapUiSmallMargin">
               <Label text="Total Tasks:" design="Bold"/>
               <Text text="{stats>/total}"/>
               
               <Label text="Completed:" design="Bold" class="sapUiSmallMarginTop"/>
               <Text text="{stats>/completed}"/>
               
               <Label text="Active:" design="Bold" class="sapUiSmallMarginTop"/>
               <Text text="{stats>/active}"/>
               
               <Label text="Completion Rate:" design="Bold" class="sapUiSmallMarginTop"/>
               <ProgressIndicator percentValue="{stats>/completionRate}" 
                                  displayValue="{stats>/completionRate}%"/>
           </VBox>
           <beginButton>
               <Button text="Close" press=".onCloseDialog"/>
           </beginButton>
       </Dialog>
   </core:FragmentDefinition>
   ```

2. Додати кнопку для відкриття в toolbar
3. Створити методи в контролері:
   ```javascript
   onShowStatistics() {
       const aTodos = this.getTodos();
       const iTotal = aTodos.length;
       const iCompleted = aTodos.filter(t => t.completed).length;
       const iActive = iTotal - iCompleted;
       const iCompletionRate = iTotal > 0 ? Math.round((iCompleted / iTotal) * 100) : 0;
       
       const oStatsModel = new JSONModel({
           total: iTotal,
           completed: iCompleted,
           active: iActive,
           completionRate: iCompletionRate
       });
       
       this.getView().setModel(oStatsModel, "stats");
       
       if (!this._oStatsDialog) {
           Fragment.load({
               name: "sap.ui.demo.todo.view.StatisticsDialog",
               controller: this
           }).then((oDialog) => {
               this._oStatsDialog = oDialog;
               this.getView().addDependent(oDialog);
               oDialog.open();
           });
       } else {
           this._oStatsDialog.open();
       }
   }
   
   onCloseDialog() {
       this._oStatsDialog.close();
   }
   ```

#### 🎯 Очікуваний результат:
При кліку на кнопку "Statistics" відкривається діалог з інформацією: скільки всього завдань, скільки завершено, відсоток виконання.

#### 💡 Що ти дізнаєшся:
- Fragment - reusable UI частини
- Dialog lifecycle
- Fragment.load() - асинхронне завантаження
- ProgressIndicator control
- Named models для окремих даних

---

### ☐ Завдання 4.3: Додай можливість перетягування для зміни порядку

**⏱️ Час:** 60 хвилин  
**🎯 Мета:** Advanced interactions - Drag & Drop

#### Що робити:

1. Увімкнути drag & drop для списку:
   ```xml
   <List id="todoList"
         mode="None"
         items="{ path: '/todos' }">
       <dragDropConfig>
           <dnd:DragInfo sourceAggregation="items" />
           <dnd:DropInfo 
               drop=".onDrop"
               dropPosition="Between" />
       </dragDropConfig>
   ```

2. Не забути додати namespace: `xmlns:dnd="sap.ui.core.dnd"`

3. Додати handler:
   ```javascript
   onDrop(oEvent) {
       const oDraggedItem = oEvent.getParameter("draggedControl");
       const oDroppedItem = oEvent.getParameter("droppedControl");
       const sDropPosition = oEvent.getParameter("dropPosition");
       
       const oDragContext = oDraggedItem.getBindingContext();
       const oDropContext = oDroppedItem.getBindingContext();
       
       const iDragIndex = parseInt(oDragContext.getPath().split("/").pop());
       let iDropIndex = parseInt(oDropContext.getPath().split("/").pop());
       
       if (sDropPosition === "After") {
           iDropIndex++;
       }
       
       const oModel = this.getModel();
       const aTodos = [...this.getTodos()];
       
       const [draggedTodo] = aTodos.splice(iDragIndex, 1);
       if (iDragIndex < iDropIndex) {
           iDropIndex--;
       }
       aTodos.splice(iDropIndex, 0, draggedTodo);
       
       oModel.setProperty("/todos", aTodos);
       this._saveToStorage();
   }
   ```

#### 🎯 Очікуваний результат:
Можна перетягувати завдання мишкою для зміни порядку.

#### 💡 Що ти дізнаєшся:
- Drag & Drop API
- DragInfo та DropInfo
- dropPosition (Before/After/On)
- Array manipulation для reordering

---

## РІВЕНЬ 5: Архітектура 🏗️

### ☐ Завдання 5.1: Винеси логіку у Formatter

**⏱️ Час:** 45 хвилин  
**🎯 Мета:** Розділення логіки (як utils в React)

#### Що робити:

1. Створити `webapp/model/formatter.js`:
   ```javascript
   sap.ui.define([], () => {
       return {
           formatDate(sDateString) {
               if (!sDateString) return "";
               const oDate = new Date(sDateString);
               const oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                   pattern: "dd MMM yyyy, HH:mm"
               });
               return oDateFormat.format(oDate);
           },
           
           formatPriorityColor(sPriority) {
               const mColors = {
                   high: "#BB0000",
                   medium: "#E9730C",
                   low: "#5E696E"
               };
               return mColors[sPriority] || mColors.low;
           },
           
           formatItemsLeft(iCount, sPlural, sSingular) {
               return iCount === 1 ? `1 ${sSingular}` : `${iCount} ${sPlural}`;
           }
       };
   });
   ```

2. Підключити в контролері:
   ```javascript
   sap.ui.define([
       "sap/ui/core/mvc/Controller",
       "sap/ui/demo/todo/model/formatter",
       // ... інші залежності
   ], (Controller, formatter, ...) => {
       return Controller.extend("sap.ui.demo.todo.controller.App", {
           formatter: formatter,
           // ... решта коду
       });
   });
   ```

3. Видалити formatters з контролера, використовувати з formatter модуля у View

#### 🎯 Очікуваний результат:
Код стає чистішим, форматери можна використовувати в різних контролерах.

#### 🔄 Паралель з React:
```javascript
// React
// utils/formatters.js
export const formatDate = (date) => { ... }

// Component.jsx
import { formatDate } from './utils/formatters';

// SAPUI5 - той самий підхід!
```

#### 💡 Що ти дізнаєшся:
- Модульна структура
- Reusable formatters
- sap.ui.define dependency injection
- Best practices для організації коду

---

### ☐ Завдання 5.2: Створи Fragment для форми додавання

**⏱️ Час:** 45 хвилин  
**🎯 Мета:** Компонентизація (як окремі компоненти в React)

#### Що робити:

1. Створити `webapp/view/AddTodoDialog.fragment.xml`:
   ```xml
   <core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">
       <Dialog title="Add New Task" contentWidth="400px">
           <VBox class="sapUiSmallMargin">
               <Label text="Task Title:" required="true"/>
               <Input id="dialogTodoInput" 
                      value="{dialog>/title}"
                      placeholder="Enter task..."/>
               
               <Label text="Priority:" class="sapUiSmallMarginTop"/>
               <Select selectedKey="{dialog>/priority}"
                       items="{priorities>/priorities}">
                   <core:Item key="{priorities>key}" text="{priorities>text}"/>
               </Select>
               
               <Label text="Category:" class="sapUiSmallMarginTop"/>
               <Select selectedKey="{dialog>/category}"
                       items="{categories>/categories}">
                   <core:Item key="{categories>key}" text="{categories>text}"/>
               </Select>
           </VBox>
           <beginButton>
               <Button text="Add" 
                       type="Emphasized" 
                       press=".onAddFromDialog"/>
           </beginButton>
           <endButton>
               <Button text="Cancel" press=".onCancelDialog"/>
           </endButton>
       </Dialog>
   </core:FragmentDefinition>
   ```

2. Замінити простий інпут кнопкою, яка відкриває діалог
3. Створити методи для роботи з діалогом

#### 🎯 Очікуваний результат:
Форма додавання винесена в окремий Dialog. Код View стає чистішим та модульнішим.

#### 🔄 Паралель з React:
```javascript
// React - окремий компонент
<AddTodoModal isOpen={isOpen} onAdd={handleAdd} />

// SAPUI5 - Fragment
<core:Fragment fragmentName="..." type="XML" />
```

#### 💡 Що ти дізнаєшся:
- Fragments для reusable UI
- Dialog patterns
- Модульна структура Views
- addDependent() для прив'язки діалогів

---

### ☐ Завдання 5.3: Додай роутинг (список + детальна сторінка)

**⏱️ Час:** 90 хвилин  
**🎯 Мета:** Navigation (як React Router)

#### Що робити:

1. Оновити `manifest.json`, додати routing:
   ```json
   "routing": {
       "config": {
           "routerClass": "sap.m.routing.Router",
           "type": "View",
           "viewType": "XML",
           "path": "sap.ui.demo.todo.view",
           "controlId": "app",
           "controlAggregation": "pages"
       },
       "routes": [
           {
               "pattern": "",
               "name": "list",
               "target": "list"
           },
           {
               "pattern": "todo/{todoId}",
               "name": "detail",
               "target": "detail"
           }
       ],
       "targets": {
           "list": {
               "viewName": "TodoList",
               "viewLevel": 1
           },
           "detail": {
               "viewName": "TodoDetail",
               "viewLevel": 2
           }
       }
   }
   ```

2. Створити `webapp/view/TodoDetail.view.xml` з детальною інформацією про завдання

3. Створити `webapp/controller/TodoDetail.controller.js`

4. Змінити App.view.xml на використання App control замість Page

5. При кліку на завдання - навігувати:
   ```javascript
   onTodoPress(oEvent) {
       const oRouter = this.getOwnerComponent().getRouter();
       const oItem = oEvent.getSource();
       const oContext = oItem.getBindingContext();
       const sTodoId = oContext.getProperty("id");
       
       oRouter.navTo("detail", {
           todoId: sTodoId
       });
   }
   ```

#### 🎯 Очікуваний результат:
При кліку на завдання відкривається окрема сторінка з деталями. URL змінюється. Кнопка "Назад" повертає до списку.

#### 🔄 Паралель з React:
```javascript
// React Router
<Route path="/todo/:id" component={TodoDetail} />
useNavigate()

// SAPUI5 Router
routing.routes[{ pattern: "todo/{todoId}" }]
oRouter.navTo()
```

#### 💡 Що ти дізнаєшся:
- Routing configuration
- Pattern matching для URLs
- Navigation між views
- Passing parameters через URL
- Deep linking

---

## 💡 Поради для роботи з ADHD

### 🎯 Структура робочої сесії:

1. **Вибери ОДНЕ завдання** - не дивись на інші
2. **Поставь таймер на 25 хвилин** (Pomodoro technique)
3. **Виконуй завдання** - фокус тільки на ньому
4. **5 хвилин перерва** - встань, пройдись
5. **Commit зміни** - бачиш прогрес у git
6. **Відзнач завдання як виконане** ✅

### ⚡ Коли важко зконцентруватися:

- **Почни з найменшого завдання** - швидка перемога = мотивація
- **Візуалізуй результат** - одразу відкрий браузер та тестуй
- **Застрягнув? Пропусти** - не треба йти по порядку
- **Зроби перерву** - краще 3 сесії по 20 хв, ніж 1 година мук
- **Використовуй music/white noise** - блокуй відволікання

### ✅ Tracking прогресу:

**Git workflow:**
```bash
git add .
git commit -m "Task 1.1: Added items counter"
```

Кожен commit = маленька перемога! 🎉

### 🚫 Чого НЕ робити:

- ❌ Намагатися зробити все за раз
- ❌ Перфекціонізм - "зроблено" краще ніж "ідеально"
- ❌ Читати документацію годинами - проби і помиляйся
- ❌ Порівнювати себе з іншими - твій темп твій
- ❌ Здаватися після першої невдачі

### 🎨 Візуальні винагороди:

Після кожного завдання ти бачиш:
- ✨ Нову фічу в додатку
- 📊 Зміни у git history
- ✅ Галочку в плані
- 🚀 Свій прогрес

**Це твій дофамін!** Використовуй його!

---

## 🔄 React → SAPUI5 Шпаргалка

| Концепція | React | SAPUI5 |
|-----------|-------|--------|
| **State** | `useState(value)` | JSONModel + `{/path}` |
| **Props** | `<Component prop={value} />` | `<Control property="{/path}" />` |
| **Two-way binding** | `value={x} onChange={setX}` | `value="{/path}"` (автоматично) |
| **Event handlers** | `onClick={handler}` | `press=".handler"` |
| **Conditional rendering** | `{show && <div/>}` | `visible="{= ${show} }"` |
| **List rendering** | `array.map(item => <div/>)` | `items="{/array}"` + aggregation |
| **Context** | `useContext()` | Named models |
| **Effects** | `useEffect()` | `onInit`, `onAfterRendering` |
| **Custom hooks** | `useCustomHook()` | Formatters, Helpers |
| **Components** | Function/Class Components | Views + Controllers |
| **Fragments** | Reusable components | XML Fragments |
| **Router** | React Router | SAPUI5 Router |
| **CSS classes** | `className` | `class` + customData |
| **Refs** | `useRef()` | `byId()` |
| **Memo** | `useMemo()` | Formatters (computed) |

### Ключові відмінності:

#### 1. **Data Binding**
React - ручне керування:
```javascript
const [count, setCount] = useState(0);
setCount(count + 1);
```

SAPUI5 - автоматичне:
```javascript
oModel.setProperty("/count", oModel.getProperty("/count") + 1);
// UI оновлюється автоматично
```

#### 2. **Event Handling**
React - inline або через props:
```jsx
<button onClick={() => handleClick(id)}>
```

SAPUI5 - через binding context:
```xml
<Button press=".onPress" />
```
```javascript
onPress(oEvent) {
    const oData = oEvent.getSource().getBindingContext().getObject();
}
```

#### 3. **List Rendering**
React - map функція:
```jsx
{items.map(item => <div key={item.id}>{item.title}</div>)}
```

SAPUI5 - aggregation binding:
```xml
<List items="{/items}">
    <CustomListItem>
        <Text text="{title}" />
    </CustomListItem>
</List>
```

#### 4. **Computed Values**
React - useMemo або inline:
```javascript
const fullName = useMemo(() => firstName + " " + lastName, [firstName, lastName]);
```

SAPUI5 - formatters:
```xml
<Text text="{path: 'firstName', formatter: '.formatFullName'}" />
```

---

## 🎓 Наступні кроки після плану

Після виконання всіх завдань ти матимеш:
- ✅ Розуміння основ SAPUI5
- ✅ Practical досвід з реальними фічами
- ✅ Портфоліо проєкт
- ✅ Впевненість у своїх навичках

### Що далі?

1. **OData Services** - підключення до backend
2. **Fiori Elements** - автоматична генерація UI
3. **Custom Controls** - створення власних компонентів
4. **SAP BTP** - deployment в хмару
5. **Fiori Launchpad** - інтеграція в екосистему SAP

---

## 📚 Корисні ресурси

- [UI5 Documentation](https://ui5.sap.com/)
- [UI5 Samples](https://ui5.sap.com/#/controls)
- [OpenUI5 GitHub](https://github.com/SAP/openui5)
- [SAP Community](https://community.sap.com/)

---

## 🎯 Твій прогрес

**Виконано:** _____ / 15 завдань  
**Рівень:** _____________  
**Дата початку:** _____________  
**Дата завершення:** _____________

---

**Пам'ятай:** Немає поганих девелоперів, є тільки різні темпи навчання. Твій ADHD - це не перешкода, а особливість. Використовуй короткі сесії, візуальні результати і маленькі перемоги для підтримки мотивації.

**Ти впораєшся! 💪**

---

*Created: October 2025*  
*Based on: SAPUI5 Todo Template Project*  
*Adapted for: Developers with React background and ADHD*

