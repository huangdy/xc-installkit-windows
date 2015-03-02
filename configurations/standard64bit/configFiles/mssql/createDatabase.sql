CREATE DATABASE core;
GO

USE core;
GO

CREATE TABLE guest.workproducts
(
id int NOT NULL IDENTITY(1,1),
ProductTypeVersion varchar(500),
ProductVersion int,
WPType varchar(500),
WPChecksum varchar(500),
Created datetime,
CreatedBy varchar(500),
LastUpdated datetime,
LastUpdatedBy varchar(500),
Kilobytes numeric,
Mimetype varchar(500),
RawXML xml,
AssociatedGroups varchar(500),
State varchar(500),
ProductID varchar(500),
DigestXML xml,
PRIMARY KEY (id)
);
