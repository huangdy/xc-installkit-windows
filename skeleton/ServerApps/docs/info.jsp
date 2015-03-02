<html>

<head>
	<!-- load the stylesheets -->
	<link rel="stylesheet" type="text/css" href="res/default.css" />

</head>

<body>

<div align="center" style="padding: 20px;">
<img src="res/UICDSLogo-sm.png">
<br />
<h1>UICDS Development Kit</h1>

<div>
<%@ page import="java.util.Properties" %>
<%
Properties prop = new Properties();
prop.load(pageContext.getServletContext().getResourceAsStream("/META-INF/MANIFEST.MF"));
%>
Revision: <%=prop.getProperty("Revision")%><br />
</div>

</div>
</body>

</html>
