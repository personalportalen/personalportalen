using System.Linq.Expressions;

namespace Application.Interfaces;
public interface IBaseRepository<TEntity> where TEntity : class
{
    Task<TEntity> AddAsync(TEntity entity);
    Task<bool> DeleteAsync(TEntity entity);
    Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? expression = null);
    Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> expression);
    Task<int> SaveAsync();
    Task<TEntity> UpdateAsync(TEntity entity);
}