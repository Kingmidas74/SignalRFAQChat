CREATE TABLE [dbo].[Questions]
(
	[Id] uniqueidentifier NOT NULL PRIMARY KEY, 
    [Text] NTEXT NOT NULL, 
	[UserId] uniqueidentifier NOT NULL
    CONSTRAINT [FK_Questions_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),

)
