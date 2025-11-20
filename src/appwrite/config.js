import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createpost({ title, slug, content, featuredImage, status, userid }) {
    try {
      return await this.databases.createDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug,
        { title, content, featuredImage, status, userid }
      );
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    }
  }

  async updatepost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug,
        { title, content, featuredImage, status }
      );
    } catch (error) {
      console.error("Update post error:", error);
      throw error;
    }
  }

  async deletepost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.error("Delete post error:", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug
      );
    } catch (error) {
      console.error("Get post error:", error);
      throw error;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        queries
      );
    } catch (error) {
      console.error("Get posts error:", error);
      return { documents: [] };
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appWriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Upload file error:", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appWriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Delete file error:", error);
      // If file not found, consider it deleted
      if (error.code === 404) {
        console.warn("File not found, may already be deleted");
        return true;
      }
      return false;
    }
  }

  // ✅ FIXED: Corrected getFilePreview method
// In config.js - keep the same method name for backwards compatibility
getFilePreview(fileId) {
    if (!fileId) {
        return null;
    }
    
    try {
        // Use getFileView which works on free tier
        const view = this.bucket.getFileView(
            conf.appWriteBucketId,
            fileId
        );
        
        return view.href || view.toString();
    } catch (error) {
        console.error("getFileView error:", error);
        return null;
    }
}
}

const service = new Service();
export default service;