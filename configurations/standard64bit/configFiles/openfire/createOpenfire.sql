USE [master]
GO
/****** Object:  Database [openfire]    Script Date: 10/28/2013 11:49:01 AM ******/
CREATE DATABASE [openfire]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'openfire', FILENAME = N'%INSTALL_HOME%\Data\openfire.mdf' , SIZE = 3136KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'openfire_log', FILENAME = N'%INSTALL_HOME%\Data\openfire_log.ldf' , SIZE = 784KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [openfire] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [openfire].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [openfire] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [openfire] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [openfire] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [openfire] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [openfire] SET ARITHABORT OFF 
GO
ALTER DATABASE [openfire] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [openfire] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [openfire] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [openfire] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [openfire] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [openfire] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [openfire] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [openfire] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [openfire] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [openfire] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [openfire] SET  ENABLE_BROKER 
GO
ALTER DATABASE [openfire] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [openfire] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [openfire] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [openfire] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [openfire] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [openfire] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [openfire] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [openfire] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [openfire] SET  MULTI_USER 
GO
ALTER DATABASE [openfire] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [openfire] SET DB_CHAINING OFF 
GO
ALTER DATABASE [openfire] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [openfire] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [openfire]
GO
/****** Object:  Table [dbo].[ofExtComponentConf]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofExtComponentConf](
	[subdomain] [nvarchar](255) NOT NULL,
	[wildcard] [int] NOT NULL,
	[secret] [nvarchar](255) NULL,
	[permission] [nvarchar](10) NOT NULL,
 CONSTRAINT [ofExtComponentConf_pk] PRIMARY KEY CLUSTERED 
(
	[subdomain] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofGroup]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofGroup](
	[groupName] [nvarchar](50) NOT NULL,
	[description] [nvarchar](255) NULL,
 CONSTRAINT [ofGroup_pk] PRIMARY KEY CLUSTERED 
(
	[groupName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofGroupProp]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofGroupProp](
	[groupName] [nvarchar](50) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[propValue] [nvarchar](2000) NOT NULL,
 CONSTRAINT [ofGroupProp_pk] PRIMARY KEY CLUSTERED 
(
	[groupName] ASC,
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofGroupUser]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofGroupUser](
	[groupName] [nvarchar](50) NOT NULL,
	[username] [nvarchar](100) NOT NULL,
	[administrator] [int] NOT NULL,
 CONSTRAINT [ofGroupUser_pk] PRIMARY KEY CLUSTERED 
(
	[groupName] ASC,
	[username] ASC,
	[administrator] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofID]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofID](
	[idType] [int] NOT NULL,
	[id] [int] NOT NULL,
 CONSTRAINT [ofID_pk] PRIMARY KEY CLUSTERED 
(
	[idType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofMucAffiliation]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofMucAffiliation](
	[roomID] [int] NOT NULL,
	[jid] [nvarchar](424) NOT NULL,
	[affiliation] [int] NOT NULL,
 CONSTRAINT [ofMucAffiliation_pk] PRIMARY KEY CLUSTERED 
(
	[roomID] ASC,
	[jid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofMucConversationLog]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofMucConversationLog](
	[roomID] [int] NOT NULL,
	[sender] [nvarchar](1024) NOT NULL,
	[nickname] [nvarchar](255) NULL,
	[logTime] [char](15) NOT NULL,
	[subject] [nvarchar](255) NULL,
	[body] [ntext] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofMucMember]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofMucMember](
	[roomID] [int] NOT NULL,
	[jid] [nvarchar](424) NOT NULL,
	[nickname] [nvarchar](255) NULL,
	[firstName] [nvarchar](100) NULL,
	[lastName] [nvarchar](100) NULL,
	[url] [nvarchar](100) NULL,
	[email] [nvarchar](100) NULL,
	[faqentry] [nvarchar](100) NULL,
 CONSTRAINT [ofMucMember_pk] PRIMARY KEY CLUSTERED 
(
	[roomID] ASC,
	[jid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofMucRoom]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofMucRoom](
	[serviceID] [int] NOT NULL,
	[roomID] [int] NOT NULL,
	[creationDate] [char](15) NOT NULL,
	[modificationDate] [char](15) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[naturalName] [nvarchar](255) NOT NULL,
	[description] [nvarchar](255) NULL,
	[lockedDate] [char](15) NOT NULL,
	[emptyDate] [char](15) NULL,
	[canChangeSubject] [int] NOT NULL,
	[maxUsers] [int] NOT NULL,
	[publicRoom] [int] NOT NULL,
	[moderated] [int] NOT NULL,
	[membersOnly] [int] NOT NULL,
	[canInvite] [int] NOT NULL,
	[roomPassword] [nvarchar](50) NULL,
	[canDiscoverJID] [int] NOT NULL,
	[logEnabled] [int] NOT NULL,
	[subject] [nvarchar](100) NULL,
	[rolesToBroadcast] [int] NOT NULL,
	[useReservedNick] [int] NOT NULL,
	[canChangeNick] [int] NOT NULL,
	[canRegister] [int] NOT NULL,
 CONSTRAINT [ofMucRoom_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofMucRoomProp]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofMucRoomProp](
	[roomID] [int] NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[propValue] [nvarchar](2000) NOT NULL,
 CONSTRAINT [ofMucRoomProp_pk] PRIMARY KEY CLUSTERED 
(
	[roomID] ASC,
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofMucService]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofMucService](
	[serviceID] [int] NOT NULL,
	[subdomain] [nvarchar](255) NOT NULL,
	[description] [nvarchar](255) NULL,
	[isHidden] [int] NOT NULL,
 CONSTRAINT [ofMucService_pk] PRIMARY KEY CLUSTERED 
(
	[subdomain] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofMucServiceProp]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofMucServiceProp](
	[serviceID] [int] NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[propValue] [nvarchar](2000) NOT NULL,
 CONSTRAINT [ofMucServiceProp_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofOffline]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofOffline](
	[username] [nvarchar](64) NOT NULL,
	[messageID] [int] NOT NULL,
	[creationDate] [char](15) NOT NULL,
	[messageSize] [int] NOT NULL,
	[stanza] [ntext] NOT NULL,
 CONSTRAINT [ofOffline_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[messageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofPresence]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofPresence](
	[username] [nvarchar](64) NOT NULL,
	[offlinePresence] [ntext] NULL,
	[offlineDate] [char](15) NOT NULL,
 CONSTRAINT [ofPresence_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofPrivacyList]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofPrivacyList](
	[username] [nvarchar](64) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[isDefault] [int] NOT NULL,
	[list] [ntext] NOT NULL,
 CONSTRAINT [ofPrivacyList_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofPrivate]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofPrivate](
	[username] [nvarchar](64) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[namespace] [nvarchar](200) NOT NULL,
	[privateData] [ntext] NOT NULL,
 CONSTRAINT [ofPrivate_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[name] ASC,
	[namespace] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofProperty]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofProperty](
	[name] [nvarchar](100) NOT NULL,
	[propValue] [ntext] NOT NULL,
 CONSTRAINT [ofProperty_pk] PRIMARY KEY CLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofPubsubAffiliation]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofPubsubAffiliation](
	[serviceID] [nvarchar](100) NOT NULL,
	[nodeID] [nvarchar](100) NOT NULL,
	[jid] [nvarchar](250) NOT NULL,
	[affiliation] [nvarchar](10) NOT NULL,
 CONSTRAINT [ofPubsubAffiliation_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[nodeID] ASC,
	[jid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofPubsubDefaultConf]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofPubsubDefaultConf](
	[serviceID] [nvarchar](100) NOT NULL,
	[leaf] [int] NOT NULL,
	[deliverPayloads] [int] NOT NULL,
	[maxPayloadSize] [int] NOT NULL,
	[persistItems] [int] NOT NULL,
	[maxItems] [int] NOT NULL,
	[notifyConfigChanges] [int] NOT NULL,
	[notifyDelete] [int] NOT NULL,
	[notifyRetract] [int] NOT NULL,
	[presenceBased] [int] NOT NULL,
	[sendItemSubscribe] [int] NOT NULL,
	[publisherModel] [nvarchar](15) NOT NULL,
	[subscriptionEnabled] [int] NOT NULL,
	[accessModel] [nvarchar](10) NOT NULL,
	[language] [nvarchar](255) NULL,
	[replyPolicy] [nvarchar](15) NULL,
	[associationPolicy] [nvarchar](15) NOT NULL,
	[maxLeafNodes] [int] NOT NULL,
 CONSTRAINT [ofPubsubDefaultConf_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[leaf] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofPubsubItem]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofPubsubItem](
	[serviceID] [nvarchar](100) NOT NULL,
	[nodeID] [nvarchar](100) NOT NULL,
	[id] [nvarchar](100) NOT NULL,
	[jid] [nvarchar](1024) NOT NULL,
	[creationDate] [char](15) NOT NULL,
	[payload] [ntext] NULL,
 CONSTRAINT [ofPubsubItem_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[nodeID] ASC,
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofPubsubNode]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofPubsubNode](
	[serviceID] [nvarchar](100) NOT NULL,
	[nodeID] [nvarchar](100) NOT NULL,
	[leaf] [int] NOT NULL,
	[creationDate] [char](15) NOT NULL,
	[modificationDate] [char](15) NOT NULL,
	[parent] [nvarchar](100) NULL,
	[deliverPayloads] [int] NOT NULL,
	[maxPayloadSize] [int] NULL,
	[persistItems] [int] NULL,
	[maxItems] [int] NULL,
	[notifyConfigChanges] [int] NOT NULL,
	[notifyDelete] [int] NOT NULL,
	[notifyRetract] [int] NOT NULL,
	[presenceBased] [int] NOT NULL,
	[sendItemSubscribe] [int] NOT NULL,
	[publisherModel] [nvarchar](15) NOT NULL,
	[subscriptionEnabled] [int] NOT NULL,
	[configSubscription] [int] NOT NULL,
	[accessModel] [nvarchar](10) NOT NULL,
	[payloadType] [nvarchar](100) NULL,
	[bodyXSLT] [nvarchar](100) NULL,
	[dataformXSLT] [nvarchar](100) NULL,
	[creator] [nvarchar](255) NOT NULL,
	[description] [nvarchar](255) NULL,
	[language] [nvarchar](255) NULL,
	[name] [nvarchar](50) NULL,
	[replyPolicy] [nvarchar](15) NULL,
	[associationPolicy] [nvarchar](15) NULL,
	[maxLeafNodes] [int] NULL,
 CONSTRAINT [ofPubsubNode_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[nodeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofPubsubNodeGroups]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofPubsubNodeGroups](
	[serviceID] [nvarchar](100) NOT NULL,
	[nodeID] [nvarchar](100) NOT NULL,
	[rosterGroup] [nvarchar](100) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofPubsubNodeJIDs]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofPubsubNodeJIDs](
	[serviceID] [nvarchar](100) NOT NULL,
	[nodeID] [nvarchar](100) NOT NULL,
	[jid] [nvarchar](250) NOT NULL,
	[associationType] [nvarchar](20) NOT NULL,
 CONSTRAINT [ofPubsubNodeJIDs_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[nodeID] ASC,
	[jid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofPubsubSubscription]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofPubsubSubscription](
	[serviceID] [nvarchar](100) NOT NULL,
	[nodeID] [nvarchar](100) NOT NULL,
	[id] [nvarchar](100) NOT NULL,
	[jid] [nvarchar](1024) NOT NULL,
	[owner] [nvarchar](1024) NOT NULL,
	[state] [nvarchar](15) NOT NULL,
	[deliver] [int] NOT NULL,
	[digest] [int] NOT NULL,
	[digest_frequency] [int] NOT NULL,
	[expire] [char](15) NULL,
	[includeBody] [int] NOT NULL,
	[showValues] [nvarchar](30) NOT NULL,
	[subscriptionType] [nvarchar](10) NOT NULL,
	[subscriptionDepth] [int] NOT NULL,
	[keyword] [nvarchar](200) NULL,
 CONSTRAINT [ofPubsubSubscription_pk] PRIMARY KEY CLUSTERED 
(
	[serviceID] ASC,
	[nodeID] ASC,
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofRemoteServerConf]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofRemoteServerConf](
	[xmppDomain] [nvarchar](255) NOT NULL,
	[remotePort] [int] NULL,
	[permission] [nvarchar](10) NOT NULL,
 CONSTRAINT [ofRemoteServerConf_pk] PRIMARY KEY CLUSTERED 
(
	[xmppDomain] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofRoster]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofRoster](
	[rosterID] [int] NOT NULL,
	[username] [nvarchar](64) NOT NULL,
	[jid] [nvarchar](1024) NOT NULL,
	[sub] [int] NOT NULL,
	[ask] [int] NOT NULL,
	[recv] [int] NOT NULL,
	[nick] [nvarchar](255) NULL,
 CONSTRAINT [ofRoster_pk] PRIMARY KEY CLUSTERED 
(
	[rosterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofRosterGroups]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofRosterGroups](
	[rosterID] [int] NOT NULL,
	[rank] [int] NOT NULL,
	[groupName] [nvarchar](255) NOT NULL,
 CONSTRAINT [ofRosterGroups_pk] PRIMARY KEY CLUSTERED 
(
	[rosterID] ASC,
	[rank] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofSASLAuthorized]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofSASLAuthorized](
	[username] [nvarchar](64) NOT NULL,
	[principal] [nvarchar](2000) NOT NULL,
 CONSTRAINT [ofSASLAuthorized_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[principal] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofSecurityAuditLog]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofSecurityAuditLog](
	[msgID] [int] NOT NULL,
	[username] [nvarchar](64) NOT NULL,
	[entryStamp] [bigint] NOT NULL,
	[summary] [nvarchar](255) NOT NULL,
	[node] [nvarchar](255) NOT NULL,
	[details] [ntext] NULL,
 CONSTRAINT [ofSecurityAuditLog_pk] PRIMARY KEY CLUSTERED 
(
	[msgID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofUser]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofUser](
	[username] [nvarchar](64) NOT NULL,
	[plainPassword] [nvarchar](32) NULL,
	[encryptedPassword] [nvarchar](255) NULL,
	[name] [nvarchar](100) NULL,
	[email] [varchar](100) NULL,
	[creationDate] [char](15) NOT NULL,
	[modificationDate] [char](15) NOT NULL,
 CONSTRAINT [ofUser_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofUserFlag]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ofUserFlag](
	[username] [nvarchar](64) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[startTime] [char](15) NULL,
	[endTime] [char](15) NULL,
 CONSTRAINT [ofUserFlag_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ofUserProp]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofUserProp](
	[username] [nvarchar](64) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[propValue] [nvarchar](2000) NOT NULL,
 CONSTRAINT [ofUserProp_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofVCard]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofVCard](
	[username] [nvarchar](64) NOT NULL,
	[vcard] [ntext] NOT NULL,
 CONSTRAINT [ofVCard_pk] PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ofVersion]    Script Date: 10/28/2013 11:49:01 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ofVersion](
	[name] [nvarchar](50) NOT NULL,
	[version] [int] NOT NULL,
 CONSTRAINT [ofVersion_pk] PRIMARY KEY CLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[ofID] ([idType], [id]) VALUES (18, 1)
GO
INSERT [dbo].[ofID] ([idType], [id]) VALUES (19, 1)
GO
INSERT [dbo].[ofID] ([idType], [id]) VALUES (23, 1)
GO
INSERT [dbo].[ofID] ([idType], [id]) VALUES (26, 2)
GO
INSERT [dbo].[ofMucService] ([serviceID], [subdomain], [description], [isHidden]) VALUES (1, N'conference', NULL, 0)
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'admin.authorizedJIDs', N'admin@%FQDN%')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.adminDN', N'cn=Directory Manager')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.adminPassword', N'%SYSADMINPASS%')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.autoFollowAliasReferrals', N'true')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.autoFollowReferrals', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.baseDN', N'dc=uicds,dc=us')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.connectionPoolEnabled', N'true')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.debugEnabled', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.emailField', N'mail')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.encloseDNs', N'true')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.groupDescriptionField', N'description')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.groupMemberField', N'uniqueMember')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.groupNameField', N'cn')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.groupSearchFilter', N'(&(cn={0})(objectClass=groupOfUniqueNames))')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.host', N'127.0.0.1')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.ldapDebugEnabled', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.nameField', N'cn')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.override.avatar', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.port', N'636')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.posixMode', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.searchFilter', N'(&(cn={0})(objectClass=inetOrgPerson))')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.sslEnabled', N'true')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.usernameField', N'cn')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'ldap.vcard-mapping', N'<![CDATA[
<vCard xmlns="vcard-temp">
  <N>
    <GIVEN>{cn}</GIVEN>
  </N> 
  <EMAIL>
    <INTERNET/> 
    <USERID>{mail}</USERID>
  </EMAIL> 
  <FN>{displayName}</FN> 
  <NICKNAME>{uid}</NICKNAME> 
  <PHOTO>
    <TYPE>image/jpeg</TYPE> 
    <BINVAL>{jpegPhoto}</BINVAL>
  </PHOTO> 
  <ADR>
    <HOME/> 
    <STREET>{homePostalAddress}</STREET>
  </ADR> 
  <ADR>
    <WORK/> 
    <STREET>{postalAddress}</STREET> 
    <LOCALITY>{l}</LOCALITY> 
    <REGION>{st}</REGION> 
    <PCODE>{postalCode}</PCODE>
  </ADR> 
  <TEL>
    <HOME/> 
    <VOICE/> 
    <NUMBER>{homePhone}</NUMBER>
  </TEL> 
  <TEL>
    <WORK/> 
    <VOICE/> 
    <NUMBER>{telephoneNumber}</NUMBER>
  </TEL> 
  <TEL>
    <WORK/> 
    <CELL/> 
    <NUMBER>{mobile}</NUMBER>
  </TEL> 
  <TEL>
    <WORK/> 
    <PAGER/> 
    <NUMBER>{pager}</NUMBER>
  </TEL> 
  <TITLE>{title}</TITLE> 
  <ORG>
    <ORGUNIT>{departmentNumber}</ORGUNIT>
  </ORG>
</vCard>]]>')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'provider.auth.className', N'org.jivesoftware.openfire.ldap.LdapAuthProvider')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'provider.group.className', N'org.jivesoftware.openfire.ldap.LdapGroupProvider')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'provider.user.className', N'org.jivesoftware.openfire.ldap.LdapUserProvider')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'provider.vcard.className', N'org.jivesoftware.openfire.ldap.LdapVCardProvider')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'update.lastCheck', N'1382981939966')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.auth.anonymous', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.domain', N'%FQDN%')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.server.certificate.accept-selfsigned', N'true')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.server.dialback.enabled', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.server.tls.enabled', N'true')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.server.certificate.verify', N'false')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.session.conflict-limit', N'0')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.socket.ssl.active', N'true')
GO
INSERT [dbo].[ofProperty] ([name], [propValue]) VALUES (N'xmpp.socket.ssl.keypass', N'%SYSADMINPASS%')
GO
INSERT [dbo].[ofPubsubAffiliation] ([serviceID], [nodeID], [jid], [affiliation]) VALUES (N'pubsub', N'', N'%FQDN%', N'owner')
GO
INSERT [dbo].[ofPubsubDefaultConf] ([serviceID], [leaf], [deliverPayloads], [maxPayloadSize], [persistItems], [maxItems], [notifyConfigChanges], [notifyDelete], [notifyRetract], [presenceBased], [sendItemSubscribe], [publisherModel], [subscriptionEnabled], [accessModel], [language], [replyPolicy], [associationPolicy], [maxLeafNodes]) VALUES (N'pubsub', 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, N'publishers', 1, N'open', N'English', NULL, N'all', -1)
GO
INSERT [dbo].[ofPubsubDefaultConf] ([serviceID], [leaf], [deliverPayloads], [maxPayloadSize], [persistItems], [maxItems], [notifyConfigChanges], [notifyDelete], [notifyRetract], [presenceBased], [sendItemSubscribe], [publisherModel], [subscriptionEnabled], [accessModel], [language], [replyPolicy], [associationPolicy], [maxLeafNodes]) VALUES (N'pubsub', 1, 1, 5120, 0, -1, 1, 1, 1, 0, 1, N'publishers', 1, N'open', N'English', NULL, N'all', -1)
GO
INSERT [dbo].[ofPubsubNode] ([serviceID], [nodeID], [leaf], [creationDate], [modificationDate], [parent], [deliverPayloads], [maxPayloadSize], [persistItems], [maxItems], [notifyConfigChanges], [notifyDelete], [notifyRetract], [presenceBased], [sendItemSubscribe], [publisherModel], [subscriptionEnabled], [configSubscription], [accessModel], [payloadType], [bodyXSLT], [dataformXSLT], [creator], [description], [language], [name], [replyPolicy], [associationPolicy], [maxLeafNodes]) VALUES (N'pubsub', N'', 0, N'001382981904332', N'001382981904332', NULL, 0, 0, 0, 0, 1, 1, 1, 0, 0, N'publishers', 1, 0, N'open', N'', N'', N'', N'%FQDN%', N'', N'English', N'', NULL, N'all', -1)
GO
INSERT [dbo].[ofPubsubSubscription] ([serviceID], [nodeID], [id], [jid], [owner], [state], [deliver], [digest], [digest_frequency], [expire], [includeBody], [showValues], [subscriptionType], [subscriptionDepth], [keyword]) VALUES (N'pubsub', N'', N'zeKBCe2yL1M3kLf3X0AKIN2HBmpzaxpeQ5SAGolD', N'%FQDN%', N'%FQDN%', N'subscribed', 1, 0, 86400000, NULL, 0, N' ', N'nodes', 1, NULL)
GO
INSERT [dbo].[ofUser] ([username], [plainPassword], [encryptedPassword], [name], [email], [creationDate], [modificationDate]) VALUES (N'admin', N'%ADMINPASS%', NULL, N'Administrator', N'admin@%FQDN%', N'0              ', N'0              ')
GO
INSERT [dbo].[ofVersion] ([name], [version]) VALUES (N'openfire', 21)
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofMucConversationLog_time_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofMucConversationLog_time_idx] ON [dbo].[ofMucConversationLog]
(
	[logTime] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [ofMucRoom_roomid_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofMucRoom_roomid_idx] ON [dbo].[ofMucRoom]
(
	[roomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [ofMucRoom_serviceid_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofMucRoom_serviceid_idx] ON [dbo].[ofMucRoom]
(
	[serviceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [ofMucService_serviceid_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofMucService_serviceid_idx] ON [dbo].[ofMucService]
(
	[serviceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofPrivacyList_default_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofPrivacyList_default_idx] ON [dbo].[ofPrivacyList]
(
	[username] ASC,
	[isDefault] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofPubsubNodeGroups_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofPubsubNodeGroups_idx] ON [dbo].[ofPubsubNodeGroups]
(
	[serviceID] ASC,
	[nodeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofRoster_jid_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofRoster_jid_idx] ON [dbo].[ofRoster]
(
	[jid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofRoster_username_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofRoster_username_idx] ON [dbo].[ofRoster]
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [ofRosterGroups_rosterid_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofRosterGroups_rosterid_idx] ON [dbo].[ofRosterGroups]
(
	[rosterID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [ofSecurityAuditLog_tstamp_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofSecurityAuditLog_tstamp_idx] ON [dbo].[ofSecurityAuditLog]
(
	[entryStamp] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofSecurityAuditLog_uname_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofSecurityAuditLog_uname_idx] ON [dbo].[ofSecurityAuditLog]
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofUser_cDate_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofUser_cDate_idx] ON [dbo].[ofUser]
(
	[creationDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofUserFlag_eTime_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofUserFlag_eTime_idx] ON [dbo].[ofUserFlag]
(
	[endTime] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON

GO
/****** Object:  Index [ofUserFlag_sTime_idx]    Script Date: 10/28/2013 11:49:02 AM ******/
CREATE NONCLUSTERED INDEX [ofUserFlag_sTime_idx] ON [dbo].[ofUserFlag]
(
	[startTime] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ofRosterGroups]  WITH CHECK ADD  CONSTRAINT [ofRosterGroups_rosterID_fk] FOREIGN KEY([rosterID])
REFERENCES [dbo].[ofRoster] ([rosterID])
GO
ALTER TABLE [dbo].[ofRosterGroups] CHECK CONSTRAINT [ofRosterGroups_rosterID_fk]
GO
USE [master]
GO
ALTER DATABASE [openfire] SET  READ_WRITE 
GO
