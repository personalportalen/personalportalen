using Application.Models;
using System.Linq.Expressions;

namespace Application.Interfaces
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        Task AddAsync(TEntity entity);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> expression);
        Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>> expression);
        Task RemoveAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task SaveAsync();
    }
}