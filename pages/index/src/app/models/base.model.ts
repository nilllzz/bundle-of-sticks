export default abstract class BaseModel {
	// We need to create some methods dynamically on the model.
	static populate: (rows: any[]) => any[];

	static create(self: any) {
		// These need to be created dynamically for each model type.
		self.populate = function(rows: any[]): any[] {
			const models: any[] = [];
			if (rows && Array.isArray(rows) && rows.length) {
				for (const row of rows) {
					models.push(new self(row));
				}
			}
			return models;
		};

		Object.assign(self.prototype, BaseModel.prototype);

		return self;
	}

	constructor(data?: any) {
		if (data) {
			Object.assign(this, data);
		}
	}
}
