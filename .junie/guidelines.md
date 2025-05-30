# Project Guidelines

## Design Guidelines
- Use MaterialUI for building the UI of the application
- If MaterialUI does not have a specific UI component, try finding libraries for that purpose
- Almost never build a UI component from scratch, try finding ready ones
- Color palette is #251605, #f6e27f, #e2c391, #a8b7ab, #9bbec7

## Architecture Guidelines
- Use React Router for routing
- Auth0 as an Identity Provider
- Do not hardcode values. Rather, have a config.js file
- Have a clear architecture: have dedicated folders for pages
- Use module CSS if needed. Take into consideration that using MaterialUI is of the highest priority

## Backend API OpenAPI Specification
```json
{
  "openapi": "3.0.4",
  "info": {
    "title": "FileFlow.Api",
    "version": "1.0"
  },
  "paths": {
    "/api/users/storage": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Retrieves user storage information",
        "description": "Returns details about the user's storage usage and limits.\n\n### Behavior\n- Returns storage information for the authenticated user\n- Calculates total used space across all the user's files\n- Provides a breakdown of storage usage by file category (documents, images, videos, other)\n- Includes the user's maximum allowed storage space\n\n### Response\nReturns a UserStorageResponse object containing information about storage usage, limits, and breakdown by file type.",
        "operationId": "GetStorageEndpoint",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserStorageResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/support/messages": {
      "post": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Send a support message",
        "description": "Sends a support message from the authenticated user to the support team",
        "operationId": "SendSupportMessageEndpoint",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SendSupportMessageRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/trash/empty": {
      "post": {
        "tags": [
          "FileFlow.Api"
        ],
        "operationId": "EmptyTrashEndpoint",
        "responses": {
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/items/recent": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Retrieves recently accessed items",
        "description": "Returns a list of files and folders that have been recently accessed or modified by the user.\n\n### Query Parameters\n- **limit** (int, optional): Maximum number of items to return. Default is typically 20.\n\n### Behavior\n- Returns only items that belong to the authenticated user\n- Returns both files and folders, sorted by last accessed or modified time, most recent first\n- Does not return items that are in trash\n- Typically includes items that were recently viewed, edited, uploaded, or downloaded\n\n### Response\nReturns an array of FileFolderResponse objects containing metadata about each recent item.",
        "operationId": "GetRecentItemsEndpoint",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FileFolderResponse"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/items/starred": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Retrieves all starred items",
        "description": "Returns a list of all files and folders that have been marked as starred by the user.\n\n### Behavior\n- Returns only items that belong to the authenticated user\n- Returns both files and folders that have IsStarred=true\n- Does not return items that are in trash, even if they are starred\n- Results are typically sorted by name or last modified date\n\n### Response\nReturns an array of FileFolderResponse objects containing metadata about each starred item.",
        "operationId": "GetStarredItemsEndpoint",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FileFolderResponse"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/items/trash": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Retrieves items in trash",
        "description": "Returns a list of all files and folders that are currently in the user's trash.\n\n### Behavior\n- Returns only items that belong to the authenticated user\n- Returns both files and folders that have IsInTrash=true\n- Results are typically sorted by the date they were moved to trash\n- May include information about when items will be automatically permanently deleted\n\n### Response\nReturns an array of FileFolderResponse objects containing metadata about each trashed item.",
        "operationId": "GetTrashItemsEndpoint",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FileFolderResponse"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/items/{id}/move": {
      "patch": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Moves an item to a different folder",
        "description": "Relocates a file or folder to a specified destination folder.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file or folder to move.\n\n### Request Body\n- **DestinationFolderId** (string): The ID of the destination folder. If not specified, root is used\n\n### Behavior\n- Only moves items that belong to the authenticated user\n- Updates the ParentId and Path properties of the moved item\n- If moving a folder, also updates paths for all contained files and subfolders\n- Cannot move items that are in trash\n- Cannot move a folder into itself or any of its subfolders (would create a circular reference)\n- If an item with the same name exists in the destination, may return an error or rename the moved item\n\n### Response\nReturns 200 Ok if successful, or appropriate error status if the operation fails.",
        "operationId": "MoveItemEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MoveItemRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/items/{id}/star": {
      "patch": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Marks an item as starred",
        "description": "Marks a specific file or folder as starred for easy access.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file or folder to star.\n\n### Behavior\n- Only stars items that belong to the authenticated user\n- Sets the IsStarred flag to true in the item's metadata\n- Works on both files and folders\n- Can star items that are in trash, though they won't appear in the starred items view until restored\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if the item doesn't exist.",
        "operationId": "StarItemEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      },
      "delete": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Removes starred status from an item",
        "description": "Removes the starred marking from a specific file or folder.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file or folder to unstar.\n\n### Behavior\n- Only affects items that belong to the authenticated user\n- Sets the IsStarred flag to false in the item's metadata\n- Works on both files and folders\n- Can unstar items even if they are in trash\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if the item doesn't exist.",
        "operationId": "UnstarItemEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/folders": {
      "post": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Creates a new folder",
        "description": "Creates a new folder in the specified location or at the root level.\n\n### Request Body\n- **FolderName** (string): The name for the new folder\n- **TargetFolderId** (string, optional): The Id of the parent folder where the new folder should be created. If null, creates at root level\n\n### Behavior\n- Validates that the folder name is valid and doesn't contain illegal characters\n- Creates a new folder with the specified name in the target location\n- If a folder with the same name already exists, returns a 400 Bad Request error\n- Folder names are case-sensitive\n\n### Response\nReturns a FileFolderResponse object containing metadata about the newly created folder.",
        "operationId": "CreateFolderEndpoint",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateFolderRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FileFolderResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/folders/{id}": {
      "delete": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Moves a folder to trash",
        "description": "Marks a folder and all its contents as being in the trash, making them inaccessible from normal views but not deleting them permanently.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the folder to move to trash.\n\n### Behavior\n- Only moves folders that belong to the authenticated user\n- Sets the IsInTrash flag to true for the folder and all files and subfolders contained within it\n- Folder and its contents remain in the system and can be restored or permanently deleted later\n- Items in trash still count against the user's storage quota\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if folder doesn't exist.",
        "operationId": "DeleteFolderEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      },
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Retrieves metadata for a specific folder",
        "description": "Retrieves detailed metadata for a specified folder.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the folder to retrieve.\n\n### Behavior\n- Returns metadata for the specified folder if it belongs to the authenticated user\n- Will return folder metadata even if the folder is in trash\n\n### Response\nReturns a FileFolderResponse object containing metadata about the folder, including its name, path, and other properties.",
        "operationId": "GetFolderEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FileFolderResponse"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      },
      "put": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Renames a folder",
        "description": "Updates the name of a specific folder.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the folder to rename.\n\n### Request Body\n- **NewFolderName** (string): The new name for the folder.\n\n### Behavior\n- Validates that the new name is valid and doesn't contain illegal characters\n- Only renames folders that belong to the authenticated user\n- Cannot rename folders that are in trash\n- Updates folder path and all paths of files and subfolders contained within it\n- If a folder with the same name already exists at the same level, returns a 400 Bad Request error\n\n### Response\nReturns 200 Ok if successful, or appropriate error status if folder not found or name is invalid.",
        "operationId": "UpdateFolderEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RenameFolderRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FileFolderResponse"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/folders/{id}/children": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Retrieves all children (files and folders) of a specific folder",
        "description": "Retrieves a list of files and folders that are direct children of the specified folder.\n\n### Route Parameters\n- **id** (string): The ID of the folder to get children from. Use \"root\" to get children of the root folder, or provide a valid GUID for a specific folder.\n\n### Behavior\n- If id is \"root\", returns all items at the root level\n- If id is a valid folder GUID, returns all direct children of that folder\n- Returns only items that belong to the authenticated user\n- Does not return items that are in trash\n\n### Response\nReturns an array of FileFolderResponse objects containing metadata about each child item.",
        "operationId": "GetChildrenEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FileFolderResponse"
                  }
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/api/folders/{id}/permanent": {
      "delete": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Permanently deletes a folder",
        "description": "Permanently removes a folder and all its contents from the system, freeing up the storage space they occupied.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the folder to permanently delete.\n\n### Behavior\n- Only deletes folders that belong to the authenticated user\n- Completely removes the folder, all its subfolders, and all files it contains from the system\n- This action is irreversible - none of the deleted items can be recovered after permanent deletion\n- The storage space will be freed and reflected in the user's quota\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if folder doesn't exist.",
        "operationId": "PermanentDeleteFolderEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/folders/{id}/restore": {
      "patch": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Restores a folder from trash",
        "description": "Recovers a folder and all its contents from the trash, making them accessible again in normal views.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the folder to restore from trash.\n\n### Behavior\n- Only restores folders that belong to the authenticated user\n- Sets the IsInTrash flag to false for the folder and all files and subfolders contained within it\n- If the folder's original parent folder no longer exists or is in trash, the folder will be moved to root\n- If a folder with the same name exists in the target location, the restored folder may be renamed\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if folder doesn't exist.",
        "operationId": "RestoreFolderEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FileFolderResponse"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/files/{id}/download": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Downloads a file's content",
        "description": "Provides the actual content of a file for download with appropriate content type and filename.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file to download.\n\n### Behavior\n- Retrieves file metadata to determine the name and content type\n- Streams the file content with range processing enabled for supporting large files\n- Only allows downloading files that belong to the authenticated user\n- Can download files even if they are in trash\n\n### Response\nReturns a stream containing the file content with the appropriate MIME type and original filename.",
        "operationId": "DownloadFileEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/files/{id}": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Retrieves metadata for a specific file",
        "description": "Retrieves detailed metadata for a specified file without its content.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file to retrieve metadata for.\n\n### Behavior\n- Returns metadata for the specified file if it belongs to the authenticated user\n- Will return file metadata even if the file is in trash\n- Does not return the actual file content (use the download endpoint for that)\n\n### Response\nReturns a FileFolderResponse object containing metadata about the file, including its name, path, size, and other properties.",
        "operationId": "GetFileEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FileFolderResponse"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      },
      "delete": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Moves a file to trash",
        "description": "Marks a file as being in the trash, making it inaccessible from normal views but not deleting it permanently.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file to move to trash.\n\n### Behavior\n- Only moves files that belong to the authenticated user\n- Sets the IsInTrash flag to true in the file metadata\n- File remains in the system and can be restored or permanently deleted later\n- Files in trash still count against the user's storage quota\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if file doesn't exist.",
        "operationId": "MoveFileToTrashEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      },
      "put": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Renames a file",
        "description": "Updates the name of a specific file while preserving its content and other properties.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file to rename.\n\n### Request Body\n- **NewName** (string): The new name for the file, including extension.\n\n### Behavior\n- Only renames files that belong to the authenticated user\n- Validates that the new name is valid (proper characters, length, etc.)\n- Ensures the extension is maintained or is valid for the file type\n- Updates the file's name and path properties\n- Cannot rename files that are in trash\n- If a file with the same name already exists in the same folder, returns a 400 Bad Request error\n\n### Response\nReturns 200 Ok if successful.\nReturns 404 Not Found if the file doesn't exist.\nReturns 400 Bad Request if the new filename is invalid or already exists in the same location.",
        "operationId": "RenameFileEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RenameFileRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "400": {
            "description": "Bad Request"
          }
        }
      }
    },
    "/api/files/{id}/permanent": {
      "delete": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Permanently deletes a file",
        "description": "Permanently removes a file from the system, freeing up the storage space it occupied.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file to permanently delete.\n\n### Behavior\n- Only deletes files that belong to the authenticated user\n- Completely removes the file content and metadata from the system\n- This action is irreversible - the file cannot be recovered after permanent deletion\n- The storage space will be freed and reflected in the user's quota\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if file doesn't exist.",
        "operationId": "PermanentDeleteFileEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/files/{id}/preview": {
      "get": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Generates a preview of a file",
        "description": "Provides a preview of the file content, optimized for in-browser viewing.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file to preview.\n\n### Behavior\n- For images: Returns a possibly resized or compressed version for faster viewing\n- For documents: May return a rendered preview or first few pages\n- For other file types: May return a representation or thumbnail\n- Only allows previewing files that belong to the authenticated user\n- Can preview files even if they are in trash\n\n### Response\nReturns the preview content with appropriate content type headers for browser rendering.",
        "operationId": "PreviewFileEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/files/{id}/restore": {
      "post": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Restores a file from trash",
        "description": "Recovers a file from the trash, making it accessible again in normal views.\n\n### Route Parameters\n- **id** (Guid): The unique identifier of the file to restore from trash.\n\n### Behavior\n- Only restores files that belong to the authenticated user\n- Sets the IsInTrash flag to false in the file metadata\n- If the file's original parent folder no longer exists or is in trash, the file will be moved to root\n- If a file with the same name exists in the target location, the restored file may be renamed\n\n### Response\nReturns 200 Ok if successful, or 404 Not Found if file doesn't exist.",
        "operationId": "RestoreFileEndpoint",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": { }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorMessage"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/files": {
      "post": {
        "tags": [
          "FileFlow.Api"
        ],
        "summary": "Uploads a new file",
        "description": "Uploads a new file to the specified folder path.\n\n### Request Form Data\n- **File** (form file): The file to upload\n- **TargetFolderId** (string, optional): The id of the folder where the file should be uploaded. If not specified, root level will be used\n\n### Behavior\n- Validates the uploaded file (size, type, etc.)\n- Checks if the target folder exists and is accessible to the user\n- Stores the file content in the system\n- Creates metadata entry for the file with appropriate file category based on extension\n- If a file with the same name already exists in the target location, may rename the new file automatically\n- Updates user's storage usage statistics\n\n### Response\nReturns a FileFolderResponse object containing metadata about the newly uploaded file, including its assigned ID and path.\nReturns 400 Bad Request if the file is invalid or exceeds user's storage quota.\nReturns 404 Not Found if the target folder doesn't exist.",
        "operationId": "UploadFileEndpoint",
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/UploadFileForm"
              }
            },
            "application/x-www-form-urlencoded": {
              "schema": {
                "$ref": "#/components/schemas/UploadFileForm"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FileFolderResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Not Found"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "CreateFolderRequest": {
        "type": "object",
        "properties": {
          "folderName": {
            "type": "string",
            "nullable": true
          },
          "targetFolderId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "ErrorMessage": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "FileFolderResponse": {
        "required": [
          "id",
          "isStarred",
          "name",
          "path",
          "type"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "nullable": true
          },
          "type": {
            "type": "string",
            "nullable": true
          },
          "isStarred": {
            "type": "boolean"
          },
          "parentId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "path": {
            "type": "string",
            "nullable": true
          },
          "size": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "fileCategory": {
            "type": "string",
            "nullable": true
          },
          "isInTrash": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "MoveItemRequest": {
        "type": "object",
        "properties": {
          "targetFolderId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RenameFileRequest": {
        "required": [
          "newName"
        ],
        "type": "object",
        "properties": {
          "newName": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RenameFolderRequest": {
        "type": "object",
        "properties": {
          "newFolderName": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "SendSupportMessageRequest": {
        "required": [
          "message",
          "subject"
        ],
        "type": "object",
        "properties": {
          "subject": {
            "type": "string",
            "nullable": true
          },
          "message": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UploadFileForm": {
        "required": [
          "file"
        ],
        "type": "object",
        "properties": {
          "file": {
            "type": "string",
            "format": "binary",
            "nullable": true
          },
          "targetFolderId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "UserStorageResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "maxSpace": {
            "type": "integer",
            "format": "int32"
          },
          "usedSpace": {
            "type": "integer",
            "format": "int32"
          },
          "documents": {
            "type": "integer",
            "format": "int32"
          },
          "images": {
            "type": "integer",
            "format": "int32"
          },
          "videos": {
            "type": "integer",
            "format": "int32"
          },
          "other": {
            "type": "integer",
            "format": "int32"
          }
        },
        "additionalProperties": false
      }
    },
    "securitySchemes": {
      "Bearer": {
        "type": "http",
        "description": "Please provide a valid token",
        "scheme": "Bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "Bearer": [ ]
    }
  ]
}
```