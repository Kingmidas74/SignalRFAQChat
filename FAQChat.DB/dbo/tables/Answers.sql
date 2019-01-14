CREATE TABLE [dbo].[Answers]
(
	[Id] uniqueidentifier NOT NULL PRIMARY KEY, 
    [Text] NTEXT NOT NULL, 
    [QuesiontId] UNIQUEIDENTIFIER NOT NULL,
	[Scores] INT NOT NULL DEFAULT 0, 
	[UserId] uniqueidentifier NOT NULL
    CONSTRAINT [FK_Answers_Users] FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
    CONSTRAINT [FK_Answers_Questions] FOREIGN KEY ([QuesiontId]) REFERENCES [Questions]([Id])

)