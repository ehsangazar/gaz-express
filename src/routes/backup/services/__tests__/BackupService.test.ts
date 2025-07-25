import BackupService from "../BackupService";

describe("BackupService", () => {
  let backupService: BackupService;

  beforeEach(() => {
    backupService = new BackupService();
  });

  describe("endpoint management", () => {
    it("should have default endpoint", () => {
      const endpoints = backupService.getEndpoints();
      expect(endpoints).toHaveLength(1);
      expect(endpoints[0].url).toBe("https://clubcp-b.fly.dev/admin/backup/trigger");
      expect(endpoints[0].name).toBe("ClubCP Backup");
    });

    it("should add new endpoint", () => {
      backupService.addEndpoint("https://example.com/backup", "Test Backup");
      const endpoints = backupService.getEndpoints();
      expect(endpoints).toHaveLength(2);
      expect(endpoints[1].url).toBe("https://example.com/backup");
      expect(endpoints[1].name).toBe("Test Backup");
    });

    it("should remove endpoint", () => {
      backupService.addEndpoint("https://example.com/backup", "Test Backup");
      backupService.removeEndpoint("https://example.com/backup");
      const endpoints = backupService.getEndpoints();
      expect(endpoints).toHaveLength(1);
      expect(endpoints[0].url).toBe("https://clubcp-b.fly.dev/admin/backup/trigger");
    });
  });

  describe("generateSummary", () => {
    it("should generate correct summary", () => {
      const mockResults = [
        {
          url: "https://example1.com",
          name: "Test 1",
          success: true,
          statusCode: 200,
          timestamp: new Date(),
        },
        {
          url: "https://example2.com",
          name: "Test 2",
          success: false,
          error: "Connection failed",
          timestamp: new Date(),
        },
      ];

      const summary = backupService.generateSummary(mockResults);
      expect(summary.total).toBe(2);
      expect(summary.successful).toBe(1);
      expect(summary.failed).toBe(1);
      expect(summary.results).toEqual(mockResults);
    });
  });
}); 